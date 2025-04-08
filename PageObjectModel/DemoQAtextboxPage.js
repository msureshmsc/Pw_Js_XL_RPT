
class DemoQAtextboxPage{
    constructor(page){
  
        this.page = page;
        this.FullName = page.getByPlaceholder('Full Name');
        this.Email = page.getByPlaceholder('name@example.com');
        this.CurrentAddress = page.getByPlaceholder('Current Address');
        this.permanentAddress = page.locator('#permanentAddress');
        this.submitbtn = page.getByRole('button', { name: 'Submit' });  
        
        this.validateName = page.locator('#name');
        this.validateEmail = page.locator('#email');
        this.validateCurrentAddress = page.locator("//p[@id='currentAddress']")
        this.validatePermananetAddress = page.locator("//p[@id='permanentAddress']");

    }

    async goto(xlURL){
        await this.page.goto(xlURL); 
    }

    async EnterTextBoxValues(td_fullname,td_email,td_currentAddress,td_permanentAddress){
        // await this.page.waitForTimeout(3000);
        await this.FullName.fill(td_fullname);
        await this.Email.fill(td_email);
        await this.CurrentAddress.fill(td_currentAddress);
        await this.permanentAddress.fill(td_permanentAddress);
        await this.submitbtn.click();  
        // await this.page.waitForTimeout(3000);
    }

    async validate(expect,td_fullname,td_email,td_currentAddress,td_permanentAddress)
    {
        const softExpect = expect.configure({soft:true});
        await softExpect(this.validateName).toContainText(`Name:${td_fullname}`);
        await softExpect( this.validateEmail).toContainText(`Email:${td_email}`);        
        await softExpect( this.validateCurrentAddress).toContainText(`Current Address :${td_currentAddress}`);
        await softExpect( this.validatePermananetAddress).toContainText(`Permananet Address :${td_permanentAddress}`);
    }
}
export { DemoQAtextboxPage };

