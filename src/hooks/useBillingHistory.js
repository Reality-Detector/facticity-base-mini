import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';

const GRAPHQL_ENDPOINT = 'https://api.goldsky.com/api/public/project_cmfezfldaja1j01vo2vbzc30c/subgraphs/payment-vault/1.0.0/gn';

const BILLING_HISTORY_QUERY = `
  query GetBillingHistory($userAddress: String!) {
    paymentProcesseds(where: { user: $userAddress }) {
      amount
      user
      transactionHash_
      timestamp_
    }
    subscriptionCreateds(where: { user: $userAddress }) {
      planId
      transactionHash_
      user
      timestamp_
    }
    subscriptionCancelleds(where: { user: $userAddress }) {
      user
      planId
      timestamp_
      transactionHash_
    }
  }
`;

export const useBillingHistory = () => {
  const { address } = useAccount();
  const [billingHistory, setBillingHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBillingHistory = async () => {
    if (!address) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: BILLING_HISTORY_QUERY,
          variables: {
            userAddress: address.toLowerCase()
          }
        })
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      // Combine payment, subscription, and cancellation data
      const combinedHistory = [];
      const { paymentProcesseds, subscriptionCreateds, subscriptionCancelleds } = data.data;

      // Create a map of subscription data by transaction hash
      const subscriptionMap = {};
      subscriptionCreateds.forEach(sub => {
        subscriptionMap[sub.transactionHash_] = sub;
      });

      // Combine payment data with subscription data
      paymentProcesseds.forEach(payment => {
        const subscription = subscriptionMap[payment.transactionHash_];
        if (subscription) {
          combinedHistory.push({
            type: 'subscription',
            transactionHash: payment.transactionHash_,
            amount: payment.amount,
            amountFormatted: formatEther(payment.amount),
            planId: subscription.planId,
            planName: getPlanName(subscription.planId),
            user: payment.user,
            paymentTimestamp: payment.timestamp_,
            subscriptionTimestamp: subscription.timestamp_,
            paymentDate: formatDate(payment.timestamp_),
            subscriptionDate: formatDate(subscription.timestamp_),
            timestamp: payment.timestamp_ || subscription.timestamp_,
            date: formatDate(payment.timestamp_ || subscription.timestamp_)
          });
        }
      });

      // Add cancellation events
      subscriptionCancelleds.forEach(cancellation => {
        combinedHistory.push({
          type: 'cancellation',
          transactionHash: cancellation.transactionHash_,
          amount: null,
          amountFormatted: null,
          planId: cancellation.planId,
          planName: getPlanName(cancellation.planId),
          user: cancellation.user,
          paymentTimestamp: null,
          subscriptionTimestamp: null,
          cancellationTimestamp: cancellation.timestamp_,
          paymentDate: null,
          subscriptionDate: null,
          cancellationDate: formatDate(cancellation.timestamp_),
          timestamp: cancellation.timestamp_,
          date: formatDate(cancellation.timestamp_)
        });
      });

      // Sort by timestamp (newest first)
      combinedHistory.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));

      setBillingHistory(combinedHistory);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching billing history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanName = (planId) => {
    switch (planId) {
      case '1':
        return 'Facticity Essential';
      case '2':
        return 'Facticity Enterprise';
      default:
        return 'Facticity Plan';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(parseInt(timestamp) * 1000).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getExplorerUrl = (hash) => {
    return `https://sepolia.basescan.org/tx/${hash}`;
  };

  // Fetch data when address changes
  useEffect(() => {
    fetchBillingHistory();
  }, [address]);

  return {
    billingHistory,
    isLoading,
    error,
    refetch: fetchBillingHistory,
    getExplorerUrl
  };
};

export default useBillingHistory;