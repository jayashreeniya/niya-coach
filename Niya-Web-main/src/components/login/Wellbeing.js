import React, { useState } from "react";
import Logo from "../../assets/images/niyalogo.png";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Wellbeing = () => {
   const [loginusername, setLoginUserName] = useState("");
   const [Attributesquestion1, setAttributesquestion1] = useState("");
   const [Attributesquestion2, setAttributesquestion2] = useState("");
   const [answers1, setAnswers1] = useState("");
   const [answers2, setAnswers2] = useState("");

   const [radio, setRadio] = useState(false);
   const [radio2, setRadio2] = useState(false);
   const [apiloaded1, setApiloaded1] = useState(false);

   const [AttributesChooseAnswers, setAttributesChooseAnswers] = useState("");
   const [assesment_test_answer, setAssesment_test_answer] = useState("");
   const [assesment_test_question, setAssesment_test_question] = useState("");
   const [upcoming_question, setUpcoming_question] = useState("");
   const [upcoming_answers, setUpcoming_answers] = useState("");

   const [checked, setChecked] = useState([]);

    let token = localStorage.getItem('accessToken');
    const navigate = useNavigate();

    const selectwellbeingQuestion1 = async (answerId) => {
      console.log("Question 1 answer selected:", answerId);
      
      if (!Attributesquestion1 || !Attributesquestion1.id) {
        alert("Question data is not loaded. Please refresh the page.");
        return;
      }

      var apiBaseUrl = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_assessmenttest/select_answers";
      
      const payload = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          "token": token,
        },
        body: JSON.stringify({
          "sequence_number": 1,
          "question_id": Attributesquestion1.id,
          "answer_id": answerId
        })
      };

      try {
        const response = await fetch(apiBaseUrl, payload);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error submitting Q1 answer:", errorData);
          alert("Failed to save answer. Please try again.");
          return;
        }
        
        const data = await response.json();
        console.log("Q1 answer saved successfully:", data);
        
        // Move to Question 2
        setRadio(true);
        
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to save answer. Please try again.");
      }
    }
   
    const SUBMITANSWERS = async (event) => {
      event.preventDefault(); // Prevent default form submission
      
      console.log("SUBMIT clicked - Question 3 answers:", {
        checked, 
        upcoming_question
      });
    
      // Validation for Question 3 (multiple select, up to 3)
      if(checked.length === 0){
        alert("Please select at least one answer.");
        return;
      }
      
      if(checked.length > 3){
        alert("Please select only up to 3 answers.");
        return;
      }

      // Question 3 uses the /select_answers endpoint
      var apiBaseUrl3 = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_assessmenttest/select_answers"
      
      // For Question 3, we should have upcoming_question set
      if (!upcoming_question || !upcoming_question.id) {
        alert("Question 3 data is not available. Please refresh and try again.");
        console.error("Missing Question 3 data:", {upcoming_question});
        return;
      }
      
      console.log("Submitting Question 3 answers:", {
        question_id: upcoming_question.id,
        answer_ids: checked,
        checked_type: typeof checked[0],
        upcoming_question_full: upcoming_question
      });
      
      const payload3 = {
           method: "POST",
              headers: {
              'Content-Type': 'application/json;',
              'accept': 'application/json',
              "token": ""+token+"",
              },
              body: JSON.stringify({
                "question_id": upcoming_question.id,
                "answer_ids": checked
              })
                 
              };


              if(token){

              fetch(apiBaseUrl3, payload3)
              .then(async (response) => {
                 
              if (!response.ok) {
              const errorData = await response.json(); // Read error response
              console.error("API Error:", errorData);
              alert("Failed to submit Question 3 answers: " + JSON.stringify(errorData));
              throw new Error(JSON.stringify(errorData)); // Handle errors
              }
              
              return response.json();
          })
          .then((data) =>{ 
              console.log("Question 3 answers submitted successfully:", data);
              
              // Question 3 is the last question, go to book appointment
              console.log("Finished assessment, going to book appointment");
              navigate("/bookappointment");

          })
          .catch((error) =>{ 
              console.error("Error submitting Question 3 answers:", error.message);
              alert("Failed to submit answers. Please try again.");
          }
      );


    } else {
        alert("Please login first.");
    }
  }

    const handleCheckboxChange = (checkboxId) => {
     
      setChecked((prev) => {
        const isChecked = checked.includes(checkboxId);
        if (isChecked) {
          //uncheck
          return checked.filter((item) => item !== checkboxId);
        } else {
          return [...prev, checkboxId];
        }
      });

    }

    
    const selectwellbeingQuestion2 = async (event1,event2) => {

      var apiBaseUrl3 = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_assessmenttest/choose_answers"
      const payload3 = {
           method: "POST",
              headers: {
              'Content-Type': 'application/json;',
              'accept': 'application/json',
              "token": ""+token+"",
              },
              body: JSON.stringify({
                "sequence_number": 2,
                "question_id": ""+event2+"",
                "answer_id": ""+event1+""
              })
                 
              };


              if(token){

              fetch(apiBaseUrl3, payload3)
              .then(async (response) => {
                 
              if (!response.ok) {
              const errorData = await response.json(); // Read error response
              throw new Error(JSON.stringify(errorData)); // Handle errors
              }else if(response.ok){
              if (response.status === 200 || response.status === 201) {
     
     
                  }
          }
          return response.json();
          })
          .then((data) =>{ 
              
             
              setAttributesChooseAnswers(data.data.attributes);
              setAssesment_test_answer(data.data.attributes.assesment_test_answer);
              setAssesment_test_question(data.data.attributes.assesment_test_question);
              setUpcoming_question(data.data.attributes.upcoming_question);
              setUpcoming_answers(data.data.attributes.upcoming_answers);
              setRadio2(true);


          })
          .catch((error) =>{ console.error("Error:", error.message)
             
              setRadio2(false);
 

          }
      );
  } 





    }
       if(token.length > 0) {
        if(apiloaded1 === false){
        var apiBaseUrl3 = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/profile_details"
        const payload3 = {
             method: "GET",
                headers: {
                'Content-Type': 'application/json;',
                'accept': 'application/json',
                "token": ""+token+"",
                }
                   
                };


                if(token){

                fetch(apiBaseUrl3, payload3)
                .then(async (response) => {
                   
                if (!response.ok) {
                const errorData = await response.json(); // Read error response
                throw new Error(JSON.stringify(errorData)); // Handle errors
                }else if(response.ok){
                if (response.status === 200 || response.status === 201) {
       
       
                    }
            }
            return response.json();
            })
            .then((data) =>{ 
             
                setApiloaded1(true);
                var fullname = data.data.attributes.full_name;
                var email = data.data.attributes.email;
                localStorage.setItem("fullname",fullname);
                localStorage.setItem("loginuseremailid",email);
                setLoginUserName(fullname);
                
              
            })
            .catch((error) =>{ console.error("Error:", error.message)
                
   
 
            }
        );
    } 



    var apiBaseUrl4 = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_assessmenttest/personality_test_questions"
    const payload4 = {
         method: "GET",
            headers: {
            'Content-Type': 'application/json;',
            'accept': 'application/json',
            "token": ""+token+"",
            }
               
            };


            if(token){

            fetch(apiBaseUrl4, payload4)
            .then(async (response) => {
               
            if (!response.ok) {
            const errorData = await response.json(); // Read error response
            throw new Error(JSON.stringify(errorData)); // Handle errors
            }else if(response.ok){
            if (response.status === 200 || response.status === 201) {
   
   
                }
        }
        return response.json();
        })
        .then((data) =>{ 
            console.log("Personality questions received:", data);
            
          setApiloaded1(true);
          
          // Handle questions dynamically based on what's returned
          if(data.data && data.data.length > 0) {
              data.data.forEach(question => {
                  if(question.attributes) {
                      if(question.attributes.sequence_number === 1){
                          // Include id from the question object
                          setAttributesquestion1({...question.attributes, id: question.id});
                          setAnswers1(question.attributes.answers || [])
                      }
                      if(question.attributes.sequence_number === 2){
                          // Include id from the question object
                          setAttributesquestion2({...question.attributes, id: question.id});
                          setAnswers2(question.attributes.answers || [])
                      }
                  }
              });
          } else {
              console.warn("No personality questions returned from API");
          }
            
          
        })
        .catch((error) =>{ console.error("Error:", error.message)
            //alert(JSON.stringify(error.message))


        }
    );
} 
        }
} else{
  alert("Please Login.")
  navigate("/");
}
   
function App() {
    return (
      
        <div>
          {/* Question 1: Radio buttons (single select) */}
       
          {answers1 && answers1.map && answers1.map((user, index) => (
           
            <div className="col-md-12" style={{"display":"inline-flex","width":"100%"}}>
            
           <div className="col-md-4"><label></label></div><div className="col-md-6" style={{ "textAlign": "left" }}>
              <label>
              <input
                type="radio"
                name="question1"
                value={user.id}
                onClick={(e) => selectwellbeingQuestion1(e.target.value)} />
              <span style={{ "paddingLeft": 10 }}>{user.answers}</span>
              </label>
            </div>
            </div>

          ))}
        </div>
     
    );
  }


  function App2() {
    return (
      <div>
        {/* Iterate over imported array in userData */}
       
          {answers2 && answers2.map && answers2.map((user, index) => (
           
               <div className="col-md-12" style={{"display":"inline-flex","width":"100%"}}>
            
            <div className="col-md-4"><label></label></div><div className="col-md-6" style={{ "textAlign": "left" }}>
            
             <ul>
            <li style={{"marginBottom":10}}> 
              <label>
                <input
                  type="radio"
                  name="question2"
                  value={user.id}
                  onClick={(e)=>{selectwellbeingQuestion2(user.id,user.assesment_test_question_id)}}
                />
                <span style={{"paddingLeft":10}}>{user.answers}</span>
              </label>
            </li>
            </ul>

            </div>
            </div>
          ))}
          </div>
       
    
    );
  }


  function App3() {
    return (
     
        <div>
          
       
  
        {/* Iterate over imported array in userData */}
        
          {/* Use current answers based on which question is being displayed */}
          {(upcoming_answers || answers1 || answers2 || []).map && (upcoming_answers || answers1 || answers2 || []).map((user, index) => (
           
              <div className="col-md-12" style={{"display":"inline-flex","width":"100%"}}>
            
            <div className="col-md-4"><label></label></div><div className="col-md-6" style={{ "textAlign": "left" }}>
            
             <ul>
            <li style={{"marginBottom":10}}> 
              <label>
                <input
                  type="checkbox"
                  value={user.id}
                  checked={checked.includes(user.id)}
                  onChange={() => handleCheckboxChange(user.id)}
                />
                <span style={{"paddingLeft":10}}>{user.answers}</span>
              </label>
            </li>
            </ul>

            </div>
            </div>
          ))}
          <Button className="" variant="primary" style={{"width":200,"marginBottom":100}} type="submit" onClick={SUBMITANSWERS}>
           SUBMIT
          </Button>

        </div>
     
    );
  }
   
    return (
       
       
       <div style={{"textAlign":"center"}}>
            <img className="img-thumbnail mx-auto d-block" src={Logo} alt="logo" style={{"width":180,"marginTop":50,"backgroundColor":"var(--body-bg)"}}/><br></br><br></br>
          
           {!radio ? (
            <div>
             <div className="col-md-12" style={{"display":"inline-flex","width":"100%"}}>
            
            <div className="col-md-4"><label></label></div><div className="col-md-6" style={{ "textAlign": "left" }}>
            
            <span style={{"fontSize":20}}>{loginusername}, {Attributesquestion1.title}</span><br></br>
            </div>
            </div>
            <App />
           </div>
          ) : (
           <div>
            {!radio2 ? (
           
              <div>
            <div className="col-md-12" style={{"display":"inline-flex","width":"100%"}}>
            
            <div className="col-md-4"><label></label></div><div className="col-md-6" style={{ "textAlign": "left" }}>
            
            <span style={{"fontSize":20}}>{loginusername}, {Attributesquestion2.title}</span><br></br>
            </div>
            </div>
          
              <App2 />
           </div>

            ) : (
              <div>
             
             <div className="col-md-12" style={{"display":"inline-flex","width":"100%"}}>
            
            <div className="col-md-4"><label></label></div><div className="col-md-6" style={{ "textAlign": "left" }}>
           
              <span style={{"fontSize":20}}>{loginusername}, {upcoming_question && upcoming_question.title ? upcoming_question.title : upcoming_question && upcoming_question.question_title ? upcoming_question.question_title : ''}</span><br></br>
              </div>
              </div>
                <App3 />
             </div>
           
            )}
           </div>
           )}
           
        </div>
    );
};

export default Wellbeing;