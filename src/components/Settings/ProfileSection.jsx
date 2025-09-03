import React from 'react';
import { Card, CardContent } from '@mui/material';
import DetailItem from './DetailItem';

const ProfileSection = ({ profile, idx }) => {
  return (
    <Card variant="outlined" sx={{ mt: 1, mb: 1 }}>
      <CardContent>
        {/* {console.log(profile.user_data[idx])} */}

        {profile.user_data[idx] && profile.user_data[idx].user_metadata && (
          <>
            {profile.user_data[idx].user_metadata.first_name && profile.user_data[idx].user_metadata.last_name && (
              <DetailItem 
                title="Name" 
                detail={profile.user_data[idx].user_metadata.first_name + " " + profile.user_data[idx].user_metadata.last_name} 
              />
            )}
            {profile.user_data[idx].user_metadata.company && (
              <DetailItem 
                title="Company" 
                detail={profile.user_data[idx].user_metadata.company} 
              />
            )}
            {profile.user_data[idx].user_metadata.occupation && (
              <DetailItem 
                title="Occupation" 
                detail={profile.user_data[idx].user_metadata.occupation} 
              />
            )}
            {profile.user_data[idx].user_metadata.linkedin && (
              <DetailItem 
                title="LinkedIn" 
                detail={profile.user_data[idx].user_metadata.linkedin} 
              />
            )}
            {profile.user_data[idx].user_metadata.industry && (
              <DetailItem 
                title="Industry" 
                detail={profile.user_data[idx].user_metadata.industry} 
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
