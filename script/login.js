function login(){
    const username=document.getElementById("username");
    const password=document.getElementById("password");
    if(password.value==="admin123" && username.value==="admin"){
        window.location.href="tracker.html";
    }
    else{
        if(username.value==="admin" && password.value!="admin123" ){
            alert("Wrong Password");
        }
        else if(username.value!="admin" && password.value==="admin123"){
            alert("Invalid Username");
        }
        else{
            alert("Invalid Username or Password");
        }
    }
}