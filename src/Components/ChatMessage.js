import React, { useEffect, useState } from 'react';
import { Typography, Box, TextField, Tabs, Tab, Button, IconButton, Tooltip } from '@mui/material';
import { Edit, Share, Close } from '@mui/icons-material';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const ChatMessage = ({ pdfUrls, setPdfUrls }) => {
  const [activeTab, setActiveTab] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const handlePDFLoadStart = () => {
    setIsLoading(true);
    setLoadError(null);
  };

  const handlePDFLoadEnd = () => {
    setIsLoading(false);
  };

  const handlePDFLoadError = (error) => {
    setIsLoading(false);
    setLoadError(error.message || 'Failed to load PDF. Please try again or contact support.');
  };

  const handleEditButtonClick = (url) => {
    window.open(url, '_blank');
  };

  const handleShareButtonClick = (pdf) => {
    setSelectedPdf(pdf);
    setCopied(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPdf(null);
  };
  const handleCloseTab = (index) => {
    const newPdfUrls = [...pdfUrls];
    newPdfUrls.splice(index, 1);
    setActiveTab(activeTab === index ? null : activeTab > index ? activeTab - 1 : activeTab);
    setPdfUrls(newPdfUrls); // Update pdfUrls state after removing the closed tab
  };

  const [tabWidth, setTabWidth] = useState(100);

  useEffect(()=>{
    updateTabWidth()
    window.addEventListener('resize', updateTabWidth);
    return () => {
      window.removeEventListener('resize', updateTabWidth);
    };

  },[pdfUrls.length])

  const updateTabWidth = () => {
    const totalWidth = document.getElementById('tabs-container').offsetWidth;
    setTabWidth(totalWidth / (pdfUrls.length+3));
  };


  

  return (
    <div >
      {/* <Box >
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => handleTabClick(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {pdfUrls.map((url, index) => (
            url && (
              <Tab
                key={index}
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {url.filename + ".pdf"}
                    <IconButton size="small" onClick={() => handleCloseTab(index)}>
                      <Close />
                    </IconButton>
                  </div>
                }
              />
            )
          ))}
        </Tabs>
      </Box>

      {activeTab !== null && (
        <Box sx={{ my: 2, width: '100%' }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => handleEditButtonClick(pdfUrls[activeTab]?.edit_link)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            startIcon={<Share />}
            onClick={() => handleShareButtonClick(pdfUrls[activeTab])}
          >
            Share
          </Button>
          {copied && <Typography variant="body2" color="success">Link copied to clipboard!</Typography>}
        </Box>
      )} */}



<Box>
  {/* <Tabs
    value={activeTab}
    onChange={(event, newValue) => handleTabClick(newValue)}
    variant="scrollable"
    scrollButtons="auto"
    allowScrollButtonsMobile
  >
    {pdfUrls.map((url, index) => (
      url && (
        <Tab
          key={index}
          label={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {url.filename + ".pdf"}
              <IconButton size="small" onClick={() => handleCloseTab(index)}>
                <Close />
              </IconButton>
            </div>
          }
        />
      )
    ))}
  </Tabs> */}

<div  style={{width:"45%",marginTop:"10px"}} >

<Tabs
  value={activeTab}
  onChange={(event, newValue) => handleTabClick(newValue)}
  sx={{padding:"0px"}}
  
  allowScrollButtonsMobile

    id="tabs-container"
      variant="standard"
      scrollButtons="auto"
      aria-label="scrollable auto tabs"

>

{pdfUrls.map((url, index) => (
    
    <Tooltip title={url.filename + ".pdf"}>
        <Tab
          sx={{width: `${tabWidth}px`,overflow:"clip",margin:"0px",padding:"0px",minWidth:"0px",marginRight:"2px",overflowX:"hidden"}}
          key={index}
          label={ <div >
          {url.filename + ".pdf"}
          <IconButton size={"5px"} onClick={() => handleCloseTab(index)}>
            <Close  />
          </IconButton>
        </div>}
        />
        </Tooltip>
      ))}

</Tabs>

</div>

  {activeTab !== null && (
    <Box sx={{ my: 2, width: '100%'}}>
      <Button
        variant="outlined"
        startIcon={<Edit />}
        onClick={() => handleEditButtonClick(pdfUrls[activeTab]?.edit_link)}
        sx={{ mr: 1 }}
      >
        Edit
      </Button>
      <Button
        variant="outlined"
        startIcon={<Share />}
        onClick={() => handleShareButtonClick(pdfUrls[activeTab])}
      >
        Share
      </Button>
      {copied && <Typography variant="body2" color="success">Link copied to clipboard!</Typography>}
    </Box>
  )}
</Box>

      {activeTab !== null && (   
        <Box
          sx={{
            my: 2,
            width: '100%',
            maxWidth: '45%', 
            '@media (max-width: 767px)': { 
              width: '100%', 
              maxWidth: '100%', 
            },
          }}
        >
        <iframe
          title={`PDF Viewer ${activeTab + 1}`}
          width="100%" 
          height="600px" 
          src={pdfUrls[activeTab]?.url}
          onLoadStart={handlePDFLoadStart}
          onLoad={handlePDFLoadEnd}
          onError={(e) => handlePDFLoadError(e.target.error)}
          style={{
            margin: '0 auto', 
            display: 'block', 
            maxWidth: '100%', 
          }}
          css={{
            '@media (min-width: 768px)': { 
              margin: '0', 
            },
          }}
        ></iframe>
          {isLoading && <Typography>Loading PDF...</Typography>}
          {loadError && <Typography>Error: {loadError}</Typography>}
        </Box>
      )}

      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex:999 , height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px', borderRadius: '5px' }}>
            <IconButton style={{ position: 'absolute', top: '5px', right: '5px' }} onClick={closeModal}>
              <Close />
            </IconButton>
            <Typography variant="h6" gutterBottom>
              Share PDF: {selectedPdf?.filename}
            </Typography>
            <Box sx={{ display: 'flex' }}>
              <TextField id="pdfUrlInputModal" value={selectedPdf?.url} readOnly fullWidth />
              <CopyToClipboard text={selectedPdf?.url} onCopy={() => setCopied(true)}>
                <Button variant="contained">Copy Link</Button>
              </CopyToClipboard>
            </Box>
          </div>
        </div>
      )}



      
    </div>





  );
};

export default ChatMessage;
