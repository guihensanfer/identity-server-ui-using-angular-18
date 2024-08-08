import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(newPasswordName: string, confirmPasswordName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const newPassword = control.get(newPasswordName);
    const confirmPassword = control.get(confirmPasswordName);

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
        
      return { passwordMismatch: true };
    }

    // No problems
    return null;
  };
}


export function passwordStrengthValidator(regex: string, elementName:string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.get(elementName)?.value;

    if (!value || !regex || regex === '') {
      return null;
    }

    const passwordRegex = new RegExp(regex);

    const passwordValid = passwordRegex.test(value);
    console.log('regex', regex);
    console.log('result', passwordValid);
    console.log('value', value);

    return !passwordValid ? { weakPassword: true } : null;
  };

}