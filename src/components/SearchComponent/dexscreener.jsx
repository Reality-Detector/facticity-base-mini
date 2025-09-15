import React from 'react';

const DexScreener = () => {
  return (
    <>
      <style>
        {`
          #dexscreener-embed {
            position: relative;
            width: 100%;
            padding-bottom: 180%;
          }
          @media (min-width: 1400px) {
            #dexscreener-embed {
              padding-bottom: 100%;
            }
          }
          #dexscreener-embed iframe {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            border: 0;
          }
        `}
      </style>
      <div id="dexscreener-embed">
        <iframe 
          src="https://dexscreener.com/base/0xD87Ea5F46615e1175c909610766E853Faa5f94Be?embed=1&loadChartSettings=0&chartLeftToolbar=0&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15"
          title="DexScreener Chart"
        />
      </div>
    </>
  );
};

export default DexScreener;