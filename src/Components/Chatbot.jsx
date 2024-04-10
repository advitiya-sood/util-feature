import 'remixicon/fonts/remixicon.css'
import React, { useState, useEffect, useRef } from 'react';
import "./Chatbot.css"
import { useParams, useSearchParams } from "react-router-dom";

import axios from 'axios'; // Import Axios
import { Buffer } from 'buffer';
import Header from './Header';
import { Grid, Button, IconButton, Tooltip, Menu,
  MenuItem, 
  Box,
  Alert} from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import FormatLineSpacingOutlinedIcon from '@mui/icons-material/FormatLineSpacingOutlined';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';
import ReactMarkdown from 'react-markdown';







function Chatbot({ setPdfUrls }) {
  const [searchParams] = useSearchParams();
  console.log(searchParams);

  const code = searchParams.get("code");
  console.log(code);
  const [Cases, setCases] = useState(["No Cases"]);


  const [name, setName] = useState("New User");
  const [email, setEmail] = useState("");
  const [userMessage, setUserMessage] = useState(null);
  const [inputInitHeight, setInputInitHeight] = useState(0);
  const [inputValue, setInputValue] = useState('No');

  const chatboxRef = useRef(null);
  const chatInputRef = useRef(null);
  const [attempts, setattempts] = useState(1);
  const [chatMessages, setChatMessages] = useState([]);
  const [queries, setqueries] = useState('');
  const [handlechat, sethandlechat] = useState([]);
  const [handlechatincoming, sethandlechatincoming] = useState([]);
  const [responsemessage, setresponsemessage] = useState({ "ans": "", "file_id": ".", "summary": "", "link": "", "page": 1, "edit_link": "" });
  const [flag, setflag] = useState([0, "No"]);
  const [history, sethistory] = useState(["No previous history"]);
  const [chat, setChat] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEld, setAnchorEld] = useState(null);
  const [showLoading,setShowLoading]=useState(false);
  const divRef = useRef(null);





  useEffect(() => {
    console.log("fetch");
    if (localStorage.getItem("name") && localStorage.getItem("name") !== "null") {
      console.log(localStorage.getItem("name"));
      const nameParam = localStorage.getItem("name");
      const emailParam = localStorage.getItem("email");
      setName(nameParam || "New User");
      setEmail(emailParam || "");
      if (emailParam) {
        fetchUserData(emailParam);
      }
    }
    else {


      const clientID = "6ej0b5k8ljvmfd6vndgaokeb8b";
      const clientSecret = "1ltb96skrjn8tcphko1pble6e05fdkmchgq0d2u8h1lv7ft6pfm2";
      const cognitoDomain = "https://verisage.auth.us-east-1.amazoncognito.com";
      const credentials = `${clientID}:${clientSecret}`;
      const base64Credentials = Buffer.from(credentials).toString("base64");
      const basicAuthorization = `Basic ${base64Credentials}`;
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: basicAuthorization,
      };


      const data = new URLSearchParams();
      let token = "";

      data.append("grant_type", "authorization_code");
      data.append("client_id", "6ej0b5k8ljvmfd6vndgaokeb8b");
      data.append("code", code);
      data.append("redirect_uri", "https://verisage.ai:3000");




      axios
        .post(`${cognitoDomain}/oauth2/token`, data, { headers })
        .then((res) => {
          if (res.status === 200) {
            token = res?.data?.access_token;
            const userInfoHeaders = {
              Authorization: "Bearer " + token,
            };
            axios
              .get(`${cognitoDomain}/oauth2/userInfo`, { headers: userInfoHeaders })
              .then((userInfo) => {
                if (userInfo.status === 200) {
                  localStorage.setItem('name', userInfo.data?.username);
                  localStorage.setItem('email', userInfo.data?.email);
                  setName(userInfo.data?.username);
                  setEmail(userInfo.data?.email);
                  return userInfo;
                } else {
                  // Handle error when unable to fetch user info
                  console.error("Failed to fetch user info");
                }
              }).then(async (userInfo) => {

                console.log(userInfo);

                const API_URL = 'https://verisage.ai:5000/load_all';


                const requestOptions = {
                  method: 'POST',
                  headers: {
                    "Content-Type": "application/json",
                  },

                  body: JSON.stringify({
                    "email_id": userInfo.data?.email
                  }),
                };

                const response = await fetch(API_URL, requestOptions);
                if (response === "Unregistered") {
                  setName("Please log in to continue");
                }
                const data = await response.json();

                console.log(data);
                return (data);
              }).then((data) => {
                if (data && data.conversation && data.conversation.L) {
                  sethistory(data.conversation.L);
                }
                if (data && data.instances && data.instances.L) {
                  setCases(data.instances.L);
                }
              })
              .catch((error) => {
                // Handle error in fetching user info
                console.error("Error fetching user info:", error);
              });
          } else {
            // Handle error when token request fails
            console.error("Token request failed:", res.status);
            // Display appropriate error m essage to the user
            alert("Failed to authenticate. Please try again.");
          }
        })
        .catch((error) => {
          // Handle error in token request
          console.error("Token request error:", error);
          // Display appropriate error message to the user
          alert("Failed to authenticate. Please try again.");
        });
    }
  },
    [code, chat]);





  useEffect(() => {
    console.log("start");
    console.log(history);
    if (history[0] !== "No previous history") {
      console.log("enter");
      console.log("history",history);
      const filteredConversations = history.filter((conversation) => {
        return conversation.M.index.S === chat;
      });
      console.log(filteredConversations);


      const newChatMessages = [];

      // Add previous conversation messages and questions alternately
      for (let i = 0; i < filteredConversations.length; i++) {
        if (filteredConversations[i].M.query && filteredConversations[i].M.query.S) {
          newChatMessages.push({
            text: filteredConversations[i].M.query.S,
            type: 'outgoing'
          });
          // Add previous conversation message
          newChatMessages.push({
            text: `${filteredConversations[i].M.answer.S}\n**FILENAME IS:** ${filteredConversations[i].M.filename.S}\n**SUMMARY IS:** ${filteredConversations[i].M.s_1.S}`,
            type: 'incoming',
            summaryType:"summary_1",
            file_id: filteredConversations[i].M.file_id.S, // Assuming a default value for file_id
            link: filteredConversations[i].M.pdf_link.S, // Assuming a default value for link
            edit_link: filteredConversations[i].M.g_link.S, // Assuming a default value for edit_link
            page: filteredConversations[i].M.page_number.N // Assuming a default value for page
          });

          // Add question from conversation if available
        }
      }

      // Set the chatMessages state with newChatMessages
      setChatMessages(newChatMessages);
    }
  }, [chat, history]);

  const fetchUserData = async (email) => {
    try {
      const API_URL = 'https://verisage.ai:5000/load_all';
      const requestOptions = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "email_id": email }),
      };
      const response = await fetch(API_URL, requestOptions);
      if (response.ok) {
        const data = await response.json();
        if (data && data.conversation && data.conversation.L) {
          sethistory(data.conversation.L);
        }
        if (data && data.instances && data.instances.L) {
          setCases(data.instances.L);
        }
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };




  useEffect(() => {
    setInputInitHeight(chatInputRef.current.scrollHeight);
  }, []);


  const handlebuttonclick = (value) => {
    let temp = attempts + 1;
    if (value == 'No') {


      setattempts(temp);
      const newMessages = [
        ...chatMessages,
        { text: "More", type: 'outgoing' }
      ];

      setChatMessages(newMessages);
      setInputValue("No");


    }
    else {


      const newMessages = [
        ...chatMessages,
        { text: "Yes", type: 'outgoing' }
      ];
      setChatMessages(newMessages);
      setattempts(2);
      setInputValue("Yes");
    }


    generateResponse(userMessage, temp, value);
  };
  useEffect(() => {

    setInputValue(flag[1]);

  }, [flag]);
  const generate_sum = async (id, type) => {
    const API_URL = 'https://verisage.ai:5000/summary';

    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          "id": id,
          "summary": type,
          "instance": chat,
          "email": email
        }),
      };

      setShowLoading(true)

      const response = await fetch(API_URL, requestOptions);
      const data = await response.json();




      if (data) {
        setresponsemessage({ "ans": type === "summary_2" ? "" : "", "filename": "", "id": data.file_id, "summaryType":type, "summary": data.summary, "subType": "summary" });

      }
      else {
        setresponsemessage({ "ans": "", "filename": "", "id": "", "summary": "", "subType": "summary" });
      }
      setShowLoading(false)
      sethandlechatincoming(data.summary);


    } catch (error) {
      //messageElement.classList.add('error');
      const messageElement = 'Oops! Something went wrong. Please try again.';
      // console.log(messageElement)
    } finally {
      chatboxRef.current.scrollTo(0, chatboxRef.current.scrollHeight);
    }


  };


  const generateResponse = async (chatElement, a, v) => {
    const API_URL = 'https://verisage.ai:5000/process_data';
    
    let messageElement = chatElement;
   

    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          "query": userMessage,
          "attempt": a,
          "response": v,
          "email": email,
          "instance": chat
        }),
      };

      setShowLoading(true)

      const response = await fetch(API_URL, requestOptions);
      const data = await response.json();




      if (data.filename.length > 0) {
        setresponsemessage({ "ans": data.answer, "filename": data.filename,summaryType: "summary_1", "id": data.file_id, "summary": data.summary, "link": data.link, "page": data.page_num, "edit_link": data.edit_link });

      }
      else {
        setresponsemessage({ "ans": "", "filename": "", "id": "", "summary": "", "link": "", "page": 1, "edit_link": "" });
      }
      setShowLoading(false)
      sethandlechatincoming(data.answer);


    } catch (error) {
      //messageElement.classList.add('error');
      messageElement = 'Oops! Something went wrong. Please try again.';
    } finally {
      chatboxRef.current.scrollTo(0, chatboxRef.current.scrollHeight);
    }
  };
  useEffect(() => {
    const newMessages = [
      ...chatMessages,
      { text: userMessage, type: 'outgoing' }
    ];

    setChatMessages(newMessages);
  }, [handlechat]);

  useEffect(() => {
    const p_message = {
      text: `${responsemessage.ans}, ${responsemessage.summary}`,
      type: 'incoming',
      file_id: responsemessage.id,
      link: responsemessage.link,
      edit_link: responsemessage.edit_link,
      page: responsemessage.page,
      summary:responsemessage.summary,
      subType: responsemessage.subType,
      summaryType:responsemessage.summaryType
    };
    const newMessages = [
      ...chatMessages,
      p_message
    ];

    setChatMessages(newMessages);
  }, [handlechatincoming]);

  const handleChat = () => {
    //setUserMessage(chatInputRef.current.value.trim());
    //if (chatInputRef.current.value.trim().length > 5) {
    // setqueries(chatInputRef.current.value.trim())
    // }
    //if (!userMessage) return;
    const newMessages = [
      ...chatMessages,
      { text: userMessage, type: 'outgoing' }
    ];

    sethandlechat(newMessages);
    console.log(newMessages);
    console.log(chatMessages);
    setattempts(1);
    setInputValue("No");
    generateResponse(userMessage, 1, "No");
    // }, 600);
  };

  const handleInputChange = (e) => {
    chatInputRef.current.style.height = `${inputInitHeight}px`;
    chatInputRef.current.style.height = `${chatInputRef.current.scrollHeight}px`;
    setUserMessage(e.target.value);

  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 800) {
      e.preventDefault();
      handleChat();


    }
  };
  const handleApiCall = (id, type) => {
    console.log(id, type);
    generate_sum(id, type);
    setAnchorEl(null);

  };
  useEffect(() => {
    chatboxRef.current.scrollTo(0, chatboxRef.current.scrollHeight);
  }, [chatMessages]);


  
    const handleCopyToClipboard = () => {
      if (divRef.current) {
        const text = divRef.current.innerText;
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed'; // Make it hidden
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);


        alert('Text has been copied to the clipboard successfully.');
      }
    }
  

  const handleMenuClick = (event) => {

    setAnchorEl(event.currentTarget);
  };
  const handleMenuClickDownload = (event) => {

    setAnchorEld(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setAnchorEld(null);
  };



  function handleDownload (message) {

    // console.log("Message----",message)
    
    var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    var postHtml = "</body></html>";

    var html = preHtml+document.getElementById(message.summaryType).innerHTML+postHtml;


    var blob = new Blob(['\ufeff', html], {
      type: 'application/msword'
  });

    // Create a temporary URL for the Blob object
    const url = URL.createObjectURL(blob);
    // Create a hidden <a> element
    const a = document.createElement('a');
    a.style.display = 'none';
    document.body.appendChild(a);
    // Set the href attribute of the <a> element to the temporary URL
    a.href = url;
    // Set the download attribute of the <a> element to the desired file name
    a.download = `${message.file_id}.doc`;
    // Trigger a click event on the <a> element to prompt the user to download the file
    a.click();
    // Cleanup: remove the temporary URL and the <a> element
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
}



  const handleDownloadPdf = (message) => {
    // Convert the message text into a PDF
    html2canvas(document.getElementById(message.summaryType))
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'pt', [canvas.width, canvas.height]);
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const offsetX = (pdfWidth - imgWidth) / 2;
        const offsetY = (pdfHeight - imgHeight) / 2;
        pdf.addImage(imgData, 'PNG', offsetX, offsetY, imgWidth, imgHeight);
        pdf.save(`${message.file_id}.pdf`);
      });
    setAnchorEld(null);
  };



  useEffect(()=>{

    if(isHovered==false){
      setAnchorEl(null);
      setAnchorEld(null);
    }

  },[isHovered])




  function parseText(message) {
    // console.log("Message-parseText",message)
    

        let text=message.text

    

    const filenameRegex = /\*\*FILENAME IS:\*\*(.*?)\*\*SUMMARY IS:\*\*/s;
    const summaryRegex = /\*\*SUMMARY IS:\*\*(.*?)$/s;

    const filenameMatch = filenameRegex.exec(text);
    const summaryMatch = summaryRegex.exec(text);

    const filename = filenameMatch ? filenameMatch[1].trim() : '';
    const summary = summaryMatch ? summaryMatch[1].trim() : '';

    let restText = text
      .replace(filenameMatch ? filenameMatch[0] : '', '')
      .replace(summaryMatch ? summaryMatch[1] : '')
      .trim();


      const answers = restText.split(/\d+\./).filter(Boolean);

      const parsedAnswer = answers.map((section, index) => {
        const parts = section?.trim().split(/\d+\./);
        return {
          title: parts[0]?.trim(),
          details: parts[1]?.trim(),
        };
      });



 

  
    return (
          
      <CardContent ref={divRef} id= {message.summaryType=="summary_2" ? "summary_2":"summary_1"} sx={{ width: "100%" }}>

      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 1, textAlign: "center" }}> { message.summaryType=="summary_2" ? "Medium Summary of": "Information of" } : {message.file_id}</Typography>
      
      {message.summaryType=="summary_1" &&

    <>
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}> Answer</Typography>
         <ul style={{ listStyleType: 'disc' }}>
      {parsedAnswer.map((section, index) => (
        <div key={index}>
          <li style={{marginTop:"10px"}} >{section.title}</li>
          {/* <li>{section.details}</li> */}
        </div>
      ))}
    </ul>

    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginTop: 1, marginBottom: 2 }}>Page No: {message.page}</Typography>
    
    </>}
        
        <div style={{ width: "100%" }}>

        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>Summary</Typography>
        {console.log("ssssssssssssssssssSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",summary)} 
         {
          message.summary ? <Typography variant='subtitle2' width="100%" style={{ width: "100%" }}>{message.summary}</Typography>
          :<Typography variant='subtitle2' width="100%" style={{ width: "100%" }}>{summary}</Typography>
         } 

       </div> 


     

      </CardContent>
       
          
    );


  }



  function DetailParseText (text){


    const CustomHeading = ({ level, children }) => {
      // Define custom styles for different heading levels
      const headingStyles = {
        fontSize: '24px',
        fontWeight: 'bold',
        marginTop: '10px',
        backgroundColor: '#D6EAF8',
        padding: '5px',
      };
  
      // Determine the appropriate heading level to render
      const HeadingComponent = `h${level}`;
  
      return (
        <HeadingComponent style={headingStyles}>
          {children}
        </HeadingComponent>
      );
    };
  
    // Custom component for rendering paragraphs with custom styles
    const CustomParagraph = ({ children }) => {
      // Define custom styles for paragraphs
      const paragraphStyles = {
        marginTop: '10px',
        width: '100%',
        backgroundColor: '#D6EAF8',
        padding: '5px',
      };
  
      return (
        <p style={paragraphStyles}>
          {children}
        </p>
      );
    };
  
    // Custom component for rendering list items with bullet points
    const CustomListItem = ({ children }) => {
      // Define custom styles for list items
      const listItemStyles = {
        backgroundColor: '#D6EAF8',
        padding: '5px',
        listStyleType: 'disc'
      };
  
      return (
        <li style={listItemStyles}>
          {children}
        </li>
      );
    };
  

  return (
     <CardContent  ref={divRef}  id="summary_3" sx={{ bgcolor: "#D6EAF8", maxWidth: "600px", margin: "20px auto", padding: "10px",paddingLeft:"20px" }} >
           <div  style={{fontSize: '24px',
              fontWeight: 'bold',     
                  padding: '5px',}} >
                    Longest summary is displayed.</div>
           <div className="markdown-container" style={{ width: '100%' }}>
      <ReactMarkdown
        components={{
          h1: CustomHeading,
          h2: CustomHeading,
          h3: CustomHeading,
          p: CustomParagraph,
          li: CustomListItem,
        }}
       
      >
        {text}
      </ReactMarkdown>
    </div>
  
     </CardContent>
  );
  }





  return (
    <div>
      <Header
        name={name}
        Cases={Cases}
        setChat={setChat}
        history={history}
        email={email} />
      <button className="chatbot-toggler" onClick={() => document.body.classList.toggle('show-chatbot')}>
        <span className="message-symbols"><i class="ri-message-2-line"></i></span>
        <span className="closed"><i class="ri-close-line"></i></span>
      </button>
      <div className="chatbot" style={{ backgroundColor: 'white' }}>
        <header style={{ backgroundColor: '#2980B9' }}>
          <h2>VERIS</h2>
          <span className="close-btn material-symbols-outlined" onClick={() => document.body.classList.remove('show-chatbot')}>
            close
          </span>
        </header>
        <ul className="chatbox" ref={chatboxRef}>
          {chatMessages.length === 0 && (
            <li className="chat incoming">
              <p>
                Welcome to <u style={{ color: 'red' }}>Veris</u> by Verisage. Please enter your query to begin.
                <br /> {/* Line break for a gap */}
                <br />
                If you have any questions consult the online page <a href="your_link_here" style={{ borderBottom: '1px solid red', color: 'inherit' }}>here</a>.
              </p>

            </li>
          )}


        {console.log("chatMessages",chatMessages)}

          {chatMessages.length > 0 && chatMessages.map((message, index) => (
            <li key={index} className={`chat ${message.type}`}>
              {message.type === 'outgoing' ? (
                <div style={{
                  maxWidth: "55%",
                  padding: "10px",
                  borderRadius: "12px", backgroundColor: "#D7BDE2"
                }}>{message.text}</div>
              ) : (
                 message.file_id &&
                <>

                  <span style={{
                    color: "white", backgroundColor: "#2980B9",
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>AI</span>

                  <Card

                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}

                    sx={{
                      width: "75%", marginTop: 2, backgroundColor: "#D6EAF8",
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: 8, padding: 1
                    }}>

              

                        {message.summaryType =="summary_3"?DetailParseText(message.text): parseText(message)}

                    
                          {isHovered && (
                            <Box
                              sx={{
                                position: "relative",
                                bottom: 5,
                                left: { xs: "5%", md: "65%" },
                                display: "flex",
                                gap: "5px",
                                width: { xs: "90%", md: "35%" },
                                borderRadius: "12px",
                                backgroundColor: "#B2BABB",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "5px",
                              }}
                            >
                              <Tooltip title="Summaries">
                                <IconButton onClick={handleMenuClick}>
                                  <SummarizeOutlinedIcon />
                                </IconButton>
                              </Tooltip>
                              <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleCloseMenu}
                              >
                                <MenuItem onClick={() => handleApiCall(message.file_id, "summary_2")}>Medium Summary</MenuItem>
                                <MenuItem onClick={() => handleApiCall(message.file_id, "summary_3")}>Detailed Summary</MenuItem>
                              </Menu>
                              {message.subType !== "summary" && (
                                <Tooltip title="Open File">
                                  <IconButton onClick={() => setPdfUrls((prevPdfUrls) => [
                                    {
                                      url: message.link,
                                      page: message.page,
                                      edit_link: message.edit_link,
                                      filename: message.file_id
                                    },
                                    ...prevPdfUrls
                                  ])}>
                                    <FileOpenOutlinedIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="Copy to Clipboard">
                                <IconButton onClick={() => handleCopyToClipboard(message)}>
                                  <FileCopyOutlinedIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download">
                                <IconButton onClick={handleMenuClickDownload}>
                                  <DownloadOutlinedIcon />
                                </IconButton>
                              </Tooltip>
                              <Menu
                                anchorEl={anchorEld}
                                open={Boolean(anchorEld)}
                                onClose={handleCloseMenu}
                              >
                                <MenuItem onClick={() => handleDownload(message)}>Download .doc</MenuItem>
                                <MenuItem onClick={() => handleDownloadPdf(message)}>Download .pdf</MenuItem>
                              </Menu>
                            </Box>
                          )}





                  </Card>
                
                        
                </>
              )}
            </li>
          ))}
        </ul>
     
     
        <div className="chat-input">

        { showLoading &&<div style={{marginLeft:"30px"}} >LOADING...</div>

          }

          <div style={{ width: "120%", display: "flex", justifyContent: "flex-end", gap: "20px", paddingBottom: "10px" }}>

            <Button variant="contained"
              onClick={() => handlebuttonclick("Yes")}
              sx={{
                padding: '5px 10px', bottom: "12%", right: "20%", borderRadius: '12px', width: "120px", bgcolor: "#2980B9"
              }}>
              Yes

            </Button>

            <Button variant="contained"
              onClick={() => handlebuttonclick("No")}
              sx={{
                padding: '5px 10px', bottom: "12%", right: "20%", borderRadius: '12px', width: "120px", bgcolor: "#2980B9"
              }}>
              More
            </Button>


          </div>

          <div style={{ display: "flex", borderTop: "1px solid #ddd" }}>
            <textarea
              value={userMessage}
              placeholder="Enter a message..."
              spellCheck={false}
              ref={chatInputRef}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            ></textarea>
            <span id="send-btn" className="material-symbols-rounded" onClick={handleChat}>
              <i style={{ fontSize: "25px" }} class="ri-arrow-right-circle-line"></i>
            </span>
          </div>
          {console.log("this is till 1")}
        </div>
      </div>
    </div>
  );
}

export default Chatbot;


