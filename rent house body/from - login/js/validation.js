
// Đối tượngs
function Validation(options){

    function getParent(element, selector){

        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
        

    }
    var seletorRule = {};

    //thực hiện hành động
    function validata(inputElement, rule){
        
        var errorElement = getParent(inputElement, options.formParent).querySelector(options.errorSlector);
        var errorMessage;


        var rules = seletorRule[rule.selector];
     
        
        for(var i = 0; i < rules.length; ++i){
            errorMessage = rules[i](inputElement.value);
            if(errorMessage) break;
        }


        if(errorMessage){
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formParent).classList.add('invalid');
        }else{
            errorElement.innerText = '';
            getParent(inputElement, options.formParent).classList.remove('invalid');
        }        
        
        return !errorMessage;
    }

    var formElement = document.querySelector(options.form);

    if(formElement){

        
        // lay du lieu
        formElement.onsubmit = function(e){
            e.preventDefault();

            var isFromVali = true;
            options.rules.forEach(function(rule){
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validata(inputElement, rule);
                //ko co loi true (isValid)
                //co loi false (!isValid)
                if(!isValid){
                    isFromVali = false;
                }
            });
            if(isFromVali){
           
                if(typeof options.onSubmit === 'function'){

                    var enableInput = formElement.querySelectorAll('[name]:not([disabled])');
                    var formValid = Array.from(enableInput).reduce(function(values, input){
                        values[input.name] = input.value
                        return values
                    },{})
                    options.onSubmit(formValid);
                } else{
                    formElement.submit();
                }
            }
        
        }


        options.rules.forEach(function(rule){

            //Lưu lại các rules trong mỗi input
            if(Array.isArray( seletorRule[rule.selector])){
                seletorRule[rule.selector].push(rule.test)
            }else{
                seletorRule[rule.selector] = [rule.test];
            }
            
            var inputElement = formElement.querySelector(rule.selector);
            if(inputElement){
                //xửa lý lỗi khi không nhập gì
                inputElement.onblur = function(){
                    validata(inputElement, rule);
                }

                //xửa lý bắt đầu nhập

                inputElement.oninput = function(){
                    var errorElement = getParent(inputElement, options.formParent).querySelector('.form-message');
                    errorElement.innerText = '';
                    getParent(inputElement, options.formParent).classList.remove('invalid');
                }


            }
        });
        
    }

}



//Định nghĩa các rule


//Nếu không viết gì in ra chữ cảnh báo
Validation.isRequired = function(selector){
    return {
        selector: selector,
        test: function(value){
            return value.trim() ? undefined : 'Vui lòng nhập trường này'
        }
    };
}


//Điêu kiện khi của gmail đúng
Validation.isEmail = function(selector){
     return {
        selector: selector,
        test: function(value){
             // Kiểm tra xem có phải là email hay không  nguồn stackoverflow
             const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
             return re.test(String(value).toLowerCase()) ? undefined : 'Vui lòng nhập email';
 
        }
    };
}


//Nhập tối thiểu ký tự 
Validation.minLength = function(selector, min){
    return {
       selector: selector,
       test: function(value){
            return value.length >= min ? undefined : `Vui lòng nhâp vào ${min} kí tự`;
       }
   };
}


//Điều kiện nhập giống pass
Validation.isConfirmed = function(selector, getConfirmValue, message){
    return {
       selector: selector,
       test: function(value){
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác'
       }
   };
}