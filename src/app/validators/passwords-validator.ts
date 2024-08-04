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