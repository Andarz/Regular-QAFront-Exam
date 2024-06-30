window.addEventListener("load", solve);

function solve() {
    // initial map elements
    let numberTicketsElement = document.getElementById('num-tickets');
    let seatingPreferenceElement = document.getElementById('seating-preference');
    let fullNameElement = document.getElementById('full-name');
    let emailElement = document.getElementById('email');
    let phoneNumberElement = document.getElementById('phone-number');
    let purchaseBtn = document.getElementById('purchase-btn');

    let previewElement = document.getElementById('ticket-preview');
    let purchaseElement = document.getElementById('ticket-purchase');
    let bottomElement = document.querySelector('.bottom-content');

    //[Purchase] button click
    purchaseBtn.addEventListener('click', onPurchase);

    function onPurchase(e) {
        e.preventDefault();
        //fields check
        if (numberTicketsElement == '' ||
            seatingPreferenceElement == '' ||
            fullNameElement == '' ||
            emailElement == '' ||
            phoneNumberElement == ''
        ) {
            return;
        }
        //building html elements
        let liElement = document.createElement('li');
        liElement.setAttribute('class', 'ticket-purchase');

        let btnContainer = document.createElement('div');
        btnContainer.setAttribute('class', 'btn-container');

        let articleElement = document.createElement('article');

        let numberTicketsParagraph = document.createElement('p');
        numberTicketsParagraph.textContent = `Count: ${numberTicketsElement.value}`;

        let seatingPreferenceParagraph = document.createElement('p');
        seatingPreferenceParagraph.textContent = `Preference: ${seatingPreferenceElement.value}`;

        let fullNameParagraph = document.createElement('p');
        fullNameParagraph.textContent = `To: ${fullNameElement.value}`;

        let emailParagraph = document.createElement('p');
        emailParagraph.textContent = `Email: ${emailElement.value}`;

        let phoneNumberParagraph = document.createElement('p');
        phoneNumberParagraph.textContent = `Phone number: ${phoneNumberElement.value}`;

        let editButton = document.createElement('button');
        editButton.setAttribute('class', 'edit-btn');
        editButton.textContent = "Edit";

        let nextButton = document.createElement('button');
        nextButton.setAttribute('class', 'next-btn');
        nextButton.textContent = "Next";

        //append all children
        articleElement.append(numberTicketsParagraph, seatingPreferenceParagraph, fullNameParagraph, emailParagraph, phoneNumberParagraph);
        btnContainer.append(editButton, nextButton);

        liElement.append(articleElement, btnContainer);

        previewElement.append(liElement);

        //save the data
        let numberTicketsForEdit = numberTicketsElement.value;
        let seatingPreferenceForEdit = seatingPreferenceElement.value;
        let fullNameForEdit = fullNameElement.value;
        let emailForEdit = emailElement.value;
        let phoneNumberForEdit = phoneNumberElement.value;

        //clear the input fields
        numberTicketsElement.value = '';
        seatingPreferenceElement.value = '';
        fullNameElement.value = '';
        emailElement.value = '';
        phoneNumberElement.value = '';

        //disabling the purchase button
        purchaseBtn.disabled = true;

        //[Edit] button click
        editButton.addEventListener('click', onEdit);

        function onEdit() {
            numberTicketsElement.value = numberTicketsForEdit;
            seatingPreferenceElement.value = seatingPreferenceForEdit;
            fullNameElement.value = fullNameForEdit;
            emailElement.value = emailForEdit;
            phoneNumberElement.value = phoneNumberForEdit;

            liElement.remove();
            purchaseBtn.disabled = false;
        }

        //[Next] button click
        nextButton.addEventListener('click', onNext);

        function onNext() {
            let liElementNext = document.createElement('li');
            liElementNext.setAttribute('class', 'ticket-purchase');

            let articleElementNext = document.createElement('article');
            articleElementNext = articleElement;

            let btnContainer = document.createElement('div');
            btnContainer.setAttribute('class', 'btn-container');

            let buyButton = document.createElement('button');
            buyButton.setAttribute('class', 'buy-btn');
            buyButton.textContent = "Buy";

            btnContainer.append(buyButton);
            liElementNext.append(articleElementNext, btnContainer);
            purchaseElement.append(liElementNext);

            liElement.remove();

            //[Buy] button click event
            buyButton.addEventListener('click', onBuy);

            function onBuy() {
                liElementNext.remove();

                let backButton = document.createElement('button');
                backButton.setAttribute('class', 'back-btn');
                backButton.textContent = "Back";

                let header2 = document.createElement('h2');
                header2.textContent = "Thank you for your purchase!";

                bottomElement.append(header2, backButton);

                //[Back] button click
                backButton.addEventListener('click', onBack);

                function onBack() {
                    window.location.reload();
                }
            }
        }
    }
}