// import React, { useState } from 'react';
// import { Upload, Check, X, AlertTriangle, History, Search, BookOpen, HelpCircle } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { ScrollArea } from '@/components/ui/scroll-area';

// const WordAddin = () => {
//   const [facts, setFacts] = useState([]);
//   const [history, setHistory] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');

//   const handleUpload = () => {
//     console.log('Document uploaded');
//   };

//   const handleCheck = () => {
//     // Simulate fetching facts from the document
//     const newFacts = [
//       { id: Date.now(), content: 'New fact to check', status: null },
//       { id: Date.now() + 1, content: 'Another fact to verify', status: null },
//     ];
//     setFacts([...facts, ...newFacts]);
//   };

//   const handleFactCheck = (id, status) => {
//     const updatedFacts = facts.map(fact => 
//       fact.id === id ? { ...fact, status } : fact
//     );
//     setFacts(updatedFacts);
    
//     const checkedFact = updatedFacts.find(fact => fact.id === id);
//     setHistory([checkedFact, ...history]);
//   };

//   const handleSearch = () => {
//     console.log('Searching for:', searchQuery);
//   };

//   return (
//     <Card className="w-96">
//       <CardHeader>
//         <CardTitle>Fact Checker</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Tabs defaultValue="factcheck">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="factcheck">Fact Check</TabsTrigger>
//             <TabsTrigger value="history">History</TabsTrigger>
//             <TabsTrigger value="search">Search</TabsTrigger>
//           </TabsList>
//           <TabsContent value="factcheck" className="space-y-2">
//             <div className="space-y-2">
//               <Button onClick={handleUpload} className="w-full">
//                 <Upload className="mr-2 h-4 w-4" /> Upload Document
//               </Button>
//               <Button onClick={handleCheck} className="w-full">
//                 <Check className="mr-2 h-4 w-4" /> Check Facts
//               </Button>
//             </div>
//             <ScrollArea className="h-64 w-full rounded-md border p-4">
//               {facts.map(fact => (
//                 <div key={fact.id} className="mb-4 p-2 border rounded">
//                   <p className="text-sm">{fact.content}</p>
//                   <div className="mt-2 flex justify-between">
//                     <Button onClick={() => handleFactCheck(fact.id, 'true')} size="sm" variant={fact.status === 'true' ? 'default' : 'outline'}>
//                       <Check className="mr-1 h-4 w-4" /> True
//                     </Button>
//                     <Button onClick={() => handleFactCheck(fact.id, 'false')} size="sm" variant={fact.status === 'false' ? 'default' : 'outline'}>
//                       <X className="mr-1 h-4 w-4" /> False
//                     </Button>
//                     <Button onClick={() => handleFactCheck(fact.id, 'unverifiable')} size="sm" variant={fact.status === 'unverifiable' ? 'default' : 'outline'}>
//                       <AlertTriangle className="mr-1 h-4 w-4" /> Unverifiable
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </ScrollArea>
//           </TabsContent>
//           <TabsContent value="history">
//             <ScrollArea className="h-64 w-full rounded-md border p-4">
//               {history.map((fact, index) => (
//                 <div key={index} className="mb-2 p-2 border rounded">
//                   <p className="text-sm">{fact.content}</p>
//                   <p className="text-xs mt-1">Status: {fact.status}</p>
//                 </div>
//               ))}
//             </ScrollArea>
//           </TabsContent>
//           <TabsContent value="search" className="space-y-2">
//             <Input
//               type="text"
//               placeholder="Search query"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <Button onClick={handleSearch} className="w-full">
//               <Search className="mr-2 h-4 w-4" /> Search
//             </Button>
//           </TabsContent>
//         </Tabs>
//         <div className="mt-4 flex justify-between">
//           <Button variant="outline" size="sm">
//             <BookOpen className="mr-2 h-4 w-4" /> Docs
//           </Button>
//           <Button variant="outline" size="sm">
//             <HelpCircle className="mr-2 h-4 w-4" /> Help
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default WordAddin;

import React, { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Tab,
  Tabs,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  ButtonGroup
} from '@mui/material';
import {
  Upload as UploadIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Error as ErrorIcon,
  History as HistoryIcon,
  Search as SearchIcon,
  MenuBook as MenuBookIcon,
  Help as HelpIcon
} from '@mui/icons-material';

const WordAddin = () => {
  const [tabValue, setTabValue] = useState(0);
  const [facts, setFacts] = useState([]);
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUpload = () => {
    console.log('Document uploaded');
  };

  const handleCheck = () => {
    // Simulate fetching facts from the document
    const newFacts = [
      { id: Date.now(), content: 'New fact to check', status: null },
      { id: Date.now() + 1, content: 'Another fact to verify', status: null },
    ];
    setFacts([...facts, ...newFacts]);
  };

  const handleFactCheck = (id, status) => {
    const updatedFacts = facts.map(fact => 
      fact.id === id ? { ...fact, status } : fact
    );
    setFacts(updatedFacts);
    
    const checkedFact = updatedFacts.find(fact => fact.id === id);
    setHistory([checkedFact, ...history]);
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardHeader title="Fact Checker" />
      <CardContent>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} centered>
          <Tab label="Fact Check" />
          <Tab label="History" />
          <Tab label="Search" />
        </Tabs>
        
        {tabValue === 0 && (
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" startIcon={<UploadIcon />} fullWidth onClick={handleUpload} sx={{ mb: 1 }}>
              Upload Document
            </Button>
            <Button variant="contained" startIcon={<CheckIcon />} fullWidth onClick={handleCheck} sx={{ mb: 2 }}>
              Check Facts
            </Button>
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {facts.map(fact => (
                <ListItem key={fact.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', border: 1, borderColor: 'grey.300', borderRadius: 1, mb: 1 }}>
                  <ListItemText primary={fact.content} />
                  <ButtonGroup size="small" sx={{ mt: 1 }}>
                    <Button onClick={() => handleFactCheck(fact.id, 'true')} startIcon={<CheckIcon />} color={fact.status === 'true' ? 'success' : 'inherit'}>
                      True
                    </Button>
                    <Button onClick={() => handleFactCheck(fact.id, 'false')} startIcon={<CloseIcon />} color={fact.status === 'false' ? 'error' : 'inherit'}>
                      False
                    </Button>
                    <Button onClick={() => handleFactCheck(fact.id, 'unverifiable')} startIcon={<ErrorIcon />} color={fact.status === 'unverifiable' ? 'warning' : 'inherit'}>
                      Unverifiable
                    </Button>
                  </ButtonGroup>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {tabValue === 1 && (
          <List sx={{ maxHeight: 300, overflow: 'auto', mt: 2 }}>
            {history.map((fact, index) => (
              <ListItem key={index} sx={{ border: 1, borderColor: 'grey.300', borderRadius: 1, mb: 1 }}>
                <ListItemText 
                  primary={fact.content}
                  secondary={`Status: ${fact.status}`}
                />
              </ListItem>
            ))}
          </List>
        )}

        {tabValue === 2 && (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search query"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Button variant="contained" startIcon={<SearchIcon />} fullWidth onClick={handleSearch}>
              Search
            </Button>
          </Box>
        )}

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" startIcon={<MenuBookIcon />} size="small">
            Docs
          </Button>
          <Button variant="outlined" startIcon={<HelpIcon />} size="small">
            Help
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WordAddin;