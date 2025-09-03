// import React from 'react';
// import { Paper, Typography, Card, CardContent, Button, Grid, Grow, Skeleton } from '@mui/material';
// import ReplayIcon from '@mui/icons-material/Replay';
// import { SourceCard } from './SourceCard';  // Assuming you have this component

// const PreFactCheckedOverlay = ({ preFactCheckedData, open, handleClose, error, loading }) => {
//     return (
//         <Grow in={open}>
//             <Paper
//                 style={{
//                     position: 'fixed',
//                     top: '50%',
//                     left: '50%',
//                     transform: 'translate(-50%, -50%)',
//                     padding: '20px',
//                     width: '80%',
//                     zIndex: 1300, // Ensures it appears on top of other content
//                     backgroundColor: 'white',
//                     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//                 }}
//             >
//                 <div>
//                     {/* Pre-Fact-Checked Data */}
//                     {preFactCheckedData ? (
//                         <>
//                             <Typography fontWeight="bold" textAlign="left">
//                                 Pre-Fact-Checked Data
//                             </Typography>

//                             <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
//                                 <Card variant="outlined">
//                                     <CardContent>
//                                         {/* Fact Data Display */}
//                                         <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
//                                             <Typography variant="body1" fontWeight="bold">
//                                                 Claim:
//                                             </Typography>
//                                             <Typography variant="body2">{preFactCheckedData.claim}</Typography>

//                                             <Typography variant="body1" fontWeight="bold">
//                                                 Sources:
//                                             </Typography>
//                                             {preFactCheckedData.sources.map((source, index) => (
//                                                 <Typography key={index} variant="body2">
//                                                     {source}
//                                                 </Typography>
//                                             ))}
//                                         </div>

//                                         <Button
//                                             variant="outlined"
//                                             color="primary"
//                                             style={{ marginTop: '10px' }}
//                                             onClick={handleClose}
//                                         >
//                                             Close
//                                         </Button>
//                                     </CardContent>
//                                 </Card>
//                             </div>
//                         </>
//                     ) : (
//                         loading ? (
//                             <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
//                                 <Skeleton variant="text" width="90%" style={{ marginBottom: '5px' }} />
//                                 <Skeleton variant="rectangular" animation="wave" width="100%" height={100} />
//                             </div>
//                         ) : (
//                             <div style={{ display: 'flex', alignItems: 'center' }}>
//                                 <Typography variant="body1" color="error">
//                                     {error}
//                                 </Typography>
//                                 <Button
//                                     variant="outlined"
//                                     color="primary"
//                                     style={{ marginLeft: '10px', padding: '4px 8px' }}
//                                     onClick={handleClose}
//                                     startIcon={<ReplayIcon />}
//                                 >
//                                     Retry
//                                 </Button>
//                             </div>
//                         )
//                     )}
//                 </div>
//             </Paper>
//         </Grow>
//     );
// };

// export default PreFactCheckedOverlay;
