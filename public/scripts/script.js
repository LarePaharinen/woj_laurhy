$().ready (() => {
    let astys = {};

    // haetaan asiakastyypit
    $.get({
        url: "http://127.0.0.1:3002/Types",
        success: (result) => {
            astys = result;
            result.forEach((r) => {
                let optstr = `<option value="${r.Avain}">${r.Lyhenne + " " + toTitleCase(r.Selite)}</option>`;
                $('#custType').append(optstr);
                $('#custCustType').append(optstr);
            });
        }
    });

    // haetaan data
    fetch = () => {
        let sp = searcParameters();
        $.get({
            url: `http://127.0.0.1:3002/Asiakas` + sp,
            success: (result) => {
                showResultInTable(result, astys);
        }});
    }


    fetchAll = () => {
        $.get({
            url: `http://127.0.0.1:3002/Asiakas`,
            success: (result) => {
                showResultInTable(result, astys);
        }});
    }

    // bindataan click-event
    $('#searchBtn').click(() => {
        fetch();
    });
    
    $('#showAll').click(() => {
        fetchAll();
    });

    // otetaan kaikki asiakaanlisäysformin elementit yhteen muuttujaan
    let allFields = $([])
        .add($('#custName'))
        .add($('#custAddress'))
        .add($('#custPostNbr'))
        .add($('#custPostOff'))
        .add($('#custCustType'));

    // luodaan asiakkaanlisäysdialogi
    let dialog = $('#addCustDialog').dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        minWidth: 400,
        width: 'auto',
        close: function() {
            form[0].reset();
            allFields.removeClass("ui-state-error");
            $('#warning').hide();
        }
    });

    // luodaan formi
    let form = dialog.find("form")
        .on("submit", (event) => {
            event.preventDefault();
            if (validateAddCust(form)) {
                let param = dialog.find("form").serialize();
                addCust(param);
            }
        }
    );

    // tekee post-kutsun palvelimelle ja vastauksen saatuaan jatkaa
    addCust = (param) => {
        $.post("http://127.0.0.1:3002/Asiakas", param)
            .done(function() {
                $('#addStatus').css("color", "green").text("Asiakkaan lisääminen onnistui").show().fadeOut(6000);
                $('#addCustDialog').dialog("close");
                fetch();
              })
            .fail(function(res) {
                console.log(res);
                
                console.log(res.responseJSON.virhe.length);

                var inputs = form.find('input');

                for (var i=0;i<res.responseJSON.virhe.length;i++){
                    console.log(res.responseJSON.virhe[i]);
                    if(res.responseJSON.virhe[i] != null){
                        console.log(i);
                        if(i < 4){
                            inputs[i].classList.toggle("ui-state-error", true);
                        }else{
                            form.find('select')[0].classList.toggle("ui-state-error", true);
                        }
                    }else{
                        if(i < 4){
                            inputs[i].classList.toggle("ui-state-error", false);
                        }else{
                            form.find('select')[0].classList.toggle("ui-state-error", false);
                        }
                    }
                }

                $('#warning').show();
                
              })
            
    }



    // näyttää lisäyksen onnistumisen tai epäonnistumisen
    showAddCustStat = (data) => {
        if (status == 'ok') {
            $('#addStatus').css("color", "green").text("Asiakkaan lisääminen onnistui")
            .show().fadeOut(6000);
        } else {
            console.log(data);
            $('#addStatus').css("color", "red").text("Lisäämisessä tapahtui virhe: " + data.status_text).show();
        }
    }

    // avataan asiakkaanlisäysdialogi jos sitä ei ole jo avattu
    $('#addCustBtn').click(() => {
        const isOpen = $('#addCustDialog').dialog("isOpen");
        if (!isOpen) {
            $('#addCustDialog').dialog("open");
        }
    });
});

// tarkistaa onko dialogin kentät täytetty ja näyttää varoitukset jos ei
validateAddCust = (form) => {
    return true;


    //Vanha toiminnallisuus kommentoitu pois, jotta voi kokeilla palvelin-puolen kenttien tarkistusta
    /*let inputs = form.find('input');
    let valid = true;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value == '') {
            inputs[i].classList.toggle("ui-state-error", true);
            valid = false;
        } else {
            inputs[i].classList.toggle("ui-state-error", false);
        }
    }
    if (form.find('select')[0].value === 'empty') {
        form.find('select')[0].classList.toggle("ui-state-error", true);
        valid = false;
    } else {
        form.find('select')[0].classList.toggle("ui-state-error", false);
    }
    if (valid) {
        $('#warning').hide();
        return true;
    }
    $('#warning').show();
    return false;*/
}

// palauttaa hakuparametri-stringin jos kentät eivät ole tyhjiä
searcParameters = () => {
    let str = '';
    if ($('#name').val().trim() != '') {
        var name = $('#name').val().trim();
        name = name.replace(/[^a-zA-Z0-9]/gi, '');
        str += `?nimi=${name}`;
    }
    if ($('#address').val().trim() != '') {
        var address = $('#address').val().trim();
        address = address.replace(/[^a-zA-Z0-9]/gi, '');
        if (str == '') {
            str += '?';
            str += `osoite=${address}`;
        }else
            str += `&osoite=${address}`;
    }
    if ($('#custType').val() !== null) {
        var custType = $('#custType').val();
        if (str == '') {
            str += '?';
            str+=`asty_avain=${custType}`;
        }else
            str+=`&asty_avain=${custType}`;
    }
    return str;
}

// tyhjentää data-tablen ja tuo haun tuloksen tableen
showResultInTable = (result, astys) => {
    $('#data tbody').empty();
    result.forEach(element => {
        let trstr = "<tr><td>" + element.NIMI + "</td>\n";
        trstr += "<td>" + element.OSOITE + "</td>\n";
        trstr += "<td>" + element.POSTINRO + "</td>\n";
        trstr += "<td>" + element.POSTITMP + "</td>\n";
        trstr += "<td>" + element.LUONTIPVM.replace(/[TZ]/gi," ") + "</td>\n";
        astys.forEach(asty => {
            if (asty.Avain === element.ASTY_AVAIN) {
                trstr += "<td>" + toTitleCase(asty.Selite) + "</td>";
            }
        });
        trstr += `<td><button onclick="deleteCustomer(${element.AVAIN});" class="deleteBtn">Poista</button></td>`;
        trstr += "</tr>\n";
        $('#data tbody').append(trstr);
    });
}


// poistetaan asiakas
deleteCustomer = (key) => {
    if (isNaN(key)) {
        return;
    }
    $.ajax({
        url: `http://127.0.0.1:3002/Asiakas/${key}`,
        type: 'DELETE',
        success: (result) => {
            fetch();
        }
    });
}

toTitleCase = (str) => {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}