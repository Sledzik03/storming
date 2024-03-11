$(document).ready(function() {
    var questions = [
        { 
            question: "Płeć", 
            type: "single", 
            options: [
                { value: "Mężczyzna", checked: false },
                { value: "Kobieta", checked: false }
            ]
        },
        {   question: "Wiek",
            type: "single",
            options:[
                {value: "Poniżej 18 lat", checked: false},
                {value: "18-20", checked: false},
                {value: "21-30", checked: false},
                {value: "31-40", checked: false},
                {value: "41-50", checked: false},
                {value: "51-60", checked: false},
                {value: "Powyżej 60 lat", checked: false}
            ] },
        { question: "Dlaczego kliknałeś/łaś w ten link?", type: "text" },
        { question: "Czy czujesz się bezpieczny/na w Internecie?",
          type: "single",
          options: [
            {value: "Tak", checked: false},
            {value: "Nie", checked: false}
          ]
    },
        {   question: "Czy wiesz co mogło Cię spotkać gdyby to był zainfekowany link?",
            type: "single",
            options: [
                {value: "Tak", checked: false},
                {value: "Nie", checked: false}
            ]
    }
    ];

    // Funkcja dodająca pytania do formularza
    function addQuestions() {
        questions.forEach(function(item, index) {
            var questionHTML = `
                <div class="question">
                    <label>${item.question}</label>
                    <div class="options">
            `;
            if(item.type === "single") {
                if (index === 4)
                {
                    questionHTML += `<input type="radio" id="answer-${index + 1}-yes" name="answer-${index + 1}" value="Tak" ${item.options[0].checked ? "checked" : ""}>
                    <label for="answer-${index + 1}-yes">Tak</label>
                    <input type="radio" id="answer-${index + 1}-no" name="answer-${index + 1}" value="Nie" ${item.options[1].checked  ? "checked" : ""}>
                    <label for="answer-${index + 1}-no">Nie</label>`;
                }
                else{
                    questionHTML += `<div class="radio-options">`; // Dodaj div dla opcji jednokrotnego wyboru
                item.options.forEach(function(option, optionIndex) {
                    questionHTML += `
                        <div class="option">
                            <input type="radio" id="answer-${index + 1}-${optionIndex + 1}" name="answer-${index + 1}" value="${option.value}" ${option.checked ? "checked" : "" }>
                            <label for="answer-${index + 1}-${optionIndex + 1}">${option.value}</label>
                        </div>
                    `;
                });
                questionHTML += `</div>`; // Zamknij div dla opcji jednokrotnego wyboru
                }
            } else if(item.type === "text") {
                
                    questionHTML += `
                    <input type="text" id="answer-${index + 1}" name="answer-${index + 1}" placeholder="Wprowadź odpowiedź" required>
                `;
            }
            questionHTML += `</div></div>`;
            $('#questions-container').append(questionHTML);
        });

        $('#answer-5-yes').change(function(){
            if($(this).prop('checked'))
            {
                $('#additional-options').show();
            }
        });

        $('#answer-5-no').change(function(){
            if($(this).prop('checked'))
            {
                $('#additional-options').hide();
            }
        });
    }

    // Dodanie pytań przy ładowaniu strony
    addQuestions();

    // Obsługa kliknięcia przycisku "Wyślij"
    $('#submit-btn').click(function() {
        var formData = {};
    
        // Sprawdź czy dane nie są puste
        var isValid = true;
        questions.forEach(function(item, index) {
            if(item.type === "single") {
                if (index===4)
                {
                    var selectedOption = $('input[name="answer-' + (index + 1) + '"]:checked').val();
                    if(selectedOption==="Nie")
                    {
                        formData['#answer-' +(index+1)] = selectedOption + ";";
                    }
                    else
                    {
                        var additionalOption = $('input[name="additional-options"]:checked').val();
                        formData['#answer- '+ (index+1)] = additionalOption + ";";
                    }
                }
                var selectedOption = $('input[name="answer-' + (index + 1) + '"]:checked').val();
                if(selectedOption === undefined) {
                    alert('Odpowiedź na pytanie ' + (index + 1) + ' jest wymagana.');
                    isValid = false;
                } else {
                    formData['answer-' + (index + 1)] = selectedOption + ";";
                }
            } else {
                var answer = $('#answer-' + (index + 1)).val();
                if(answer === '') {
                    alert('Odpowiedź na pytanie ' + (index + 1) + ' jest wymagana.');
                    isValid = false;
                } else {
                    formData['answer-' + (index + 1)] = answer + ";";
                }
            }
        });
    
        if(isValid) {
            $.ajax({
                type: 'POST',
                url: 'handler.php',
                data: {"data": formData},
                success: function(response) {
                    console.log('Dane zostały pomyślnie wysłane.');
                    console.log(response);
                    console.log(formData);
                    alert("Dziękujemy za przystąpienie do badań :)");
                    window.location.href = "http://giving-pipefish-sweet.ngrok-free.app/templates/sunshine/index.html"
                },
                error: function(xhr, status, error) {
                    console.error('Wystąpił błąd podczas wysyłania danych:', error);
                }
            });
        } else {
            console.error('Formularz zawiera błędy. Proszę uzupełnić wszystkie pola.');
        }
    });
});