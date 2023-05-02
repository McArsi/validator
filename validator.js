class Validator {
    constructor(form) {
        this.patterns = {
            name: /^[a-zа-яё\-]{1,122}$/i,
            surname: /^[a-zа-яё\-]{1,43}$/i,
            email: /^[\w._-]+@\w+\.[a-z]{2,4}$/i,
            pass: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
            checkPass: function (value) {
                let password = document.getElementById('pass').value;
                if (value === password) {
                    return true;
                }
            },
            age: function (value) {
                    var date = new Date();
                    var day = date.getDate();
                    var month = date.getMonth() + 1;
                    month = String(month);
                    if (month.length < 2) {
                        month = '0' + month;
                    }
                    var year = date.getFullYear();

                    var userYear = value.split('-')[0];
                    var userMonth = value.split('-')[1];
                    var userDay = value.split('-')[2];

                    if ((year - userYear) > 18) {
                        return true;
                    } else if ((year - userYear) == 18) {
                        if ((month - userMonth) > 0) {
                            return true;
                        } else if ((month - userMonth) == 0) {
                            if ((day - userDay) > 0) {
                                return true;
                            } else if ((day - userDay) == 0) {
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
            }
        };
        this.errors = {
            name: 'Имя содержит только буквы  и символ "-" и должно быть не длинее 122 символов',
            surname: 'Фамилия может содержать только буквы и символ "-" и должна быть не длинее 43 символов',
            email: 'Некорректный e-mail адрес',
            pass: 'Пароль должен быть не менее 8 символов, содержать хотя бы одну цифру, одну прописную букву, одну заглавную букву и спецсимвол и не содержать кириллицу',
            checkPass: 'Пароли должны совпадать',
            age: 'Вы должны быть старше 18 лет.'
        };
        this.errorClass = 'error-msg';
        this.form = form;
        this.valBtn = document.getElementById('val-btn');
        this.valid = false;
        this._validateForm();
    }

    _validateForm() {
        let errors = [...document.getElementById(this.form).querySelectorAll(`.${this.errorClass}`)];
        for (let error of errors) {
            error.remove();
        }
        let formFields = [...document.getElementById(this.form).getElementsByTagName('input')];
        for (let field of formFields) {
            this._validate(field);
        }
        if (![...document.getElementById(this.form).querySelectorAll('.invalid')].length) {
            this.valid = true;
            this.valBtn.classList.remove ('disable');
        } else if ([...document.getElementById(this.form).querySelectorAll('.invalid')].length) {
            this.valBtn.classList.add ('disable');
        }
    }
    _validate(field) {
        if (this.patterns[field.name]) {
            if (typeof this.patterns[field.name] != "function") {
                if (!this.patterns[field.name].test(field.value)) {
                    field.classList.add('invalid');
                    this._addErrorMsg(field);
                    this._watchField(field);
                }
            } else {
                if (!this.patterns[field.name](field.value)) {
                    field.classList.add('invalid');
                    this._addErrorMsg(field);
                    this._watchField(field);
                }
            }

        }
    }
    _addErrorMsg(field) {
        let error = `<div class="${this.errorClass}">${this.errors[field.name]}</div> `;
        field.parentNode.insertAdjacentHTML('beforeend', error);
    }
    _watchField(field) {
        field.addEventListener('input', () => {
            let error = field.parentNode.querySelector(`.${this.errorClass}`);
            if (typeof this.patterns[field.name] != "function") {
                if (this.patterns[field.name].test(field.value)) {
                    field.classList.remove('invalid');
                    field.classList.add('valid');
                    if (error) {
                        error.remove();
                    }
                } else {
                    field.classList.remove('valid');
                    field.classList.add('invalid');
                    if (!error) {
                        this._addErrorMsg(field);
                    }
                }
            } else {
                if (this.patterns[field.name](field.value)) {
                    field.classList.remove('invalid');
                    field.classList.add('valid');
                    if (error) {
                        error.remove();
                    }
                } else {
                    field.classList.remove('valid');
                    field.classList.add('invalid');
                    if (!error) {
                        this._addErrorMsg(field);
                    }
                }
            }
            if (!document.querySelectorAll('.invalid').length) {
                this.valBtn.classList.remove ('disable');
            }
        })
    }
}







