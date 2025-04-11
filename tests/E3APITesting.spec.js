import axios from 'axios';
import { test, expect } from '@playwright/test';
const softExpect = expect.configure({ soft: true });


test('TEST1_reqresgetuser2', async ({ page }) => {
  try {
    const response = await axios.get('https://reqres.in/api/users/2');

    const res_email = response.data.data.email;
    const res_id = response.data.data.id;
    try 
    {      
      softExpect(res_email).toBe('janet.weaver@reqres.in');     
      console.log("Inside the try 1 - Email to validate");
    }
    catch (error1) 
    {
      console.log("Inside the catch1 block");
      console.log(error1);
    }
    try 
    {      
      softExpect(res_id).toBe(2);    
      console.log("Inside the try 2 - Respond ID to validate");
    } 
    catch (error2) 
    {
      console.log("Inside the catch 2 block");
      console.log(error2);
    }
 } 
  catch (error) {
    console.error('Error making API request:', error);
  }
});

test('TEST2_reqresgetuser3', async ({ page }) => {
  try {
    const response = await axios.get('https://reqres.in/api/users/3');

    console.log("<<<<<<<<<<<<<<<<<<<<<<<<TEST2_reqresgetuser3>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    const res_email = response.data.data.email;
    const res_id = response.data.data.id;

    console.log(`res_email:${res_email}`);  
    console.log(`res_id:${res_id}`);
    try 
    {      
      softExpect(res_email).toBe('emma.wong@reqres.in');     
      console.log("Inside the try 1 - Email ID to validate");
    }
    catch (error1) 
    {
      console.log("Inside the catch1 block");
      console.log(error1);
    }

    try 
    {      
      softExpect(res_id).toBe(3);    
      console.log("Inside the try 2 - Response ID to validate");
    } 
    catch (error2) 
    {
      console.log("Inside the catch 2 block");
      console.log(error2);
    }
 } 
  catch (error) {
    console.error('Error making API request:', error);
  }
});
