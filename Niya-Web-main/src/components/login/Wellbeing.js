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

    const selectwellbeingQuestion1 = async (event) => {

      setRadio(true);
      console.log(radio);

    }
   
    const SUBMITANSWERS = async (event) => {
      console.log(AttributesChooseAnswers+" "+assesment_test_answer+" "+assesment_test_question);
    
      if(checked.length === 0){
        alert("please select answers.")
        return;
      }
      
      if(checked.length > 3){
          alert("select only three.")
          return;
        }

        var apiBaseUrl3 = "https://niya-178517-ruby.b178517.prod.eastus.az.svc.builder.ai/bx_block_assessmenttest/select_answers"
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
              throw new Error(JSON.stringify(errorData)); // Handle errors
              }else if(response.ok){
              if (response.status === 200 || response.status === 201) {
     
     
                  }
          }
          return response.json();
          })
          .then((data) =>{ 
              
             
              navigate("/bookappointment");


          })
          .catch((error) =>{ console.error("Error:", error.message)
             // alert(JSON.stringify(error.message))
              
 

          }
      );


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

      var apiBaseUrl3 = "https://niya-178517-ruby.b178517.prod.eastus.az.svc.builder.ai/bx_block_assessmenttest/choose_answers"
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
        var apiBaseUrl3 = "https://niya-178517-ruby.b178517.prod.eastus.az.svc.builder.ai/profile_details"
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



    var apiBaseUrl4 = "https://niya-178517-ruby.b178517.prod.eastus.az.svc.builder.ai/bx_block_assessmenttest/personality_test_questions"
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
            
            
          setApiloaded1(true);
            if(data.data[1].attributes.sequence_number === 1){
                setAttributesquestion1(data.data[1].attributes);
                setAnswers1(data.data[1].attributes.answers)
            }
            if(data.data[0].attributes.sequence_number === 2){
                setAttributesquestion2(data.data[0].attributes);
                setAnswers2(data.data[0].attributes.answers)
                
            }
            //var fullname = data.data.attributes.full_name;
           
            //localStorage.setItem("fullname",fullname);
            //setLoginUserName(fullname);
            
          
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
                  {/* Iterate over imported array in userData */}
       
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
        
          {upcoming_answers && upcoming_answers.map && upcoming_answers.map((user, index) => (
           
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
           
              <span style={{"fontSize":20}}>{loginusername}, {upcoming_question.question_title}</span><br></br>
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