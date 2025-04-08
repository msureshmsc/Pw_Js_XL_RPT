import { expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

class HerokuAppPage{
    constructor(page){
  
        this.page = page;
        this.locators = {
          ForgotPassword_RetrievePasswordBtn: page.locator("//button[@id='form_submit' and @type='submit']"),
          ForgotPassword_EmailTextbox: page.getByRole('textbox', { name: 'E-mail' }),
          ForgotPassword_InternalServerError: page.getByRole('heading', { name: 'Internal Server Error' }),
          ForgotPassword_ForgotPasswordHeading: page.getByRole('heading', { name: 'Forgot Password' }),
          ForgotPassword_EmailLabel: page.getByText('E-mail'),
          ForgotPassword_PoweredBy: page.locator("//div[text()='Powered by ']")
      };
    }

    // Function to dynamically fetch a locator based on the fieldName
    getLocator(fieldName) {
      const fieldLocatorName = `${fieldName}`;
      if (this.locators[fieldLocatorName]) {
          console.log(`<<<<<<<<<<<<<<<<<<<<${this.locators[fieldLocatorName]}>>>>>>>>>>>>>>>>>>>>>>>>>>`)
          return this.locators[fieldLocatorName];
      } else {
          throw new Error(`Locator for field "${fieldName}" not found.`);
      }
    }

    async goto(xlURL){
        await this.page.goto(xlURL); 
    }

    async compareFieldScreenshot(fieldName, actualFieldSS, expectedFieldSS) {
      // Define the directory where screenshots are stored
      const fldScreenshotDir = path.resolve('screenshotsField');
      console.log(`screenshotDir = ${fldScreenshotDir}`);
    
      const actualPath = path.join(fldScreenshotDir, actualFieldSS);
      const expectedPath = path.join(fldScreenshotDir, expectedFieldSS);
      const diffPath = path.join(fldScreenshotDir, `diff-${actualFieldSS}`);
    
      // Dynamically get the locator using the fieldName
      const element = await this.getLocator(fieldName);
  
          // Ensure the element is in the DOM and visible
      if (!(await element.isVisible())) {
        throw new Error(`Element for ${fieldName} is not visible.`);
      }
      else{
        console.log(`${fieldName} is Visible.`);
        console.log(`${element}`);
      }
      // Capture the actual screenshot of the element
      await element.screenshot({ path: actualPath });
  
      // Read both images
      const actualImage = PNG.sync.read(fs.readFileSync(actualPath));
      const expectedImage = PNG.sync.read(fs.readFileSync(expectedPath));
  
      // // Validate size
      // if (actualImage.width !== expectedImage.width || actualImage.height !== expectedImage.height) {
      //     throw new Error('Image dimensions do not match.');
      // }

            // Validate size with logging
      if (actualImage.width !== expectedImage.width || actualImage.height !== expectedImage.height) {
        // console.log('Image dimensions do not match. Actual:', actualImage, 'Expected:', expectedImage);
        // Continue execution without throwing an error
      }

  
      // Compare using pixelmatch
      const diff = new PNG({ width: actualImage.width, height: actualImage.height });
      const numDiffPixels = pixelmatch(
          actualImage.data,
          expectedImage.data,
          diff.data,
          actualImage.width,
          actualImage.height,
          { threshold: 0.1 }
      );
  
      // Save diff image if mismatch
      if (numDiffPixels > 0) {
          fs.writeFileSync(diffPath, PNG.sync.write(diff));
          console.warn(`⚠️  Pixel mismatch found: ${numDiffPixels} pixels differ.`);
          console.warn(`🖼️  Diff saved to: ${diffPath}`);
      } else {
          console.log('✅ Visual comparison passed. No pixel mismatch.');
      }
      expect(numDiffPixels).toBe(0);
  }
  



    // async compareFieldScreenshot(fieldName, actualFieldSS, expectedFieldSS) {
    //   // const element = await this.page.locator(selector);

    //   const screenshotDir = path.resolve('screenshotsField');
    //   console.log(`screenshotDir = ${screenshotDir}`);
    
    //   const actualPath = path.join(screenshotDir, actualFieldSS);
    //   const expectedPath = path.join(screenshotDir, expectedFieldSS);
    //   const diffPath = path.join(screenshotDir, `diff-${actualFieldSS}`);
    
    //   // Capture actual screenshot
    //   await this.page.screenshot({ path: actualPath, fullPage: true });
    
    //   // Read both images
    //   const actualImage = PNG.sync.read(fs.readFileSync(actualPath));
    //   const expectedImage = PNG.sync.read(fs.readFileSync(expectedPath));
    
    //   // Validate size
    //   if (actualImage.width !== expectedImage.width || actualImage.height !== expectedImage.height) {
    //     throw new Error('Image dimensions do not match.');
    //   }
    
    //   // Compare using pixelmatch
    //   const diff = new PNG({ width: actualImage.width, height: actualImage.height });
    //   const numDiffPixels = pixelmatch(
    //     actualImage.data,
    //     expectedImage.data,
    //     diff.data,
    //     actualImage.width,
    //     actualImage.height,
    //     { threshold: 0.1 }
    //   );
    
    //   // Save diff image if mismatch
    //   if (numDiffPixels > 0) {
    //     fs.writeFileSync(diffPath, PNG.sync.write(diff));
    //     console.warn(`⚠️  Pixel mismatch found: ${numDiffPixels} pixels differ.`);
    //     console.warn(`🖼️  Diff saved to: ${diffPath}`);
    //   } else {
    //     console.log('✅ Visual comparison passed. No pixel mismatch.');
    //   }
    //   expect(numDiffPixels).toBe(0);
    // }

    async comparePageScreenshot(actualPage, expectedPage) {
      const screenshotDir = path.resolve('screenshots');
      console.log(`screenshotDir = ${screenshotDir}`);
    
      const actualPath = path.join(screenshotDir, actualPage);
      const expectedPath = path.join(screenshotDir, expectedPage);
      const diffPath = path.join(screenshotDir, `diff-${actualPage}`);
    
      // Capture actual screenshot
      await this.page.screenshot({ path: actualPath, fullPage: true });
    
      // Read both images
      const actualImage = PNG.sync.read(fs.readFileSync(actualPath));
      const expectedImage = PNG.sync.read(fs.readFileSync(expectedPath));
    
      // Validate size
      if (actualImage.width !== expectedImage.width || actualImage.height !== expectedImage.height) {
        throw new Error('Image dimensions do not match.');
      }
    
      // Compare using pixelmatch
      const diff = new PNG({ width: actualImage.width, height: actualImage.height });
      const numDiffPixels = pixelmatch(
        actualImage.data,
        expectedImage.data,
        diff.data,
        actualImage.width,
        actualImage.height,
        { threshold: 0.1 }
      );
    
      // Save diff image if mismatch
      if (numDiffPixels > 0) {
        fs.writeFileSync(diffPath, PNG.sync.write(diff));
        console.warn(`⚠️  Pixel mismatch found: ${numDiffPixels} pixels differ.`);
        console.warn(`🖼️  Diff saved to: ${diffPath}`);
      } else {
        console.log('✅ Visual comparison passed. No pixel mismatch.');
      }
      expect(numDiffPixels).toBe(0);
    }


  }
export { HerokuAppPage };
