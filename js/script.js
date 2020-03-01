$( document ).ready( function() {
/*
=====================================================================
*   Global Object
===================================================================== 
*/
var eventsObject = { events: [ ], date: [ ] };
var calendar = {
    fullDayOfWeek : [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
    abvDayOfWeek  : [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
    fullMonth     : [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
    abvMonth      : [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
}

/*
=====================================================================
*   Login Form
===================================================================== 
*/
$(function() {
    var button = $( "#loginButton" );
    var box    = $( "#loginBox" );
    var form   = $( "#loginForm" );
    button.removeAttr( "href" );
    button.mouseup( function( login ) {
        box.toggle();
        button.toggleClass( "active" );
    });
    form.mouseup( function() { 
        return false;
    });
    $( this ).mouseup( function( login ) {
        if( !( $( login.target ).parent( "#loginButton" ).length > 0 ) ) {
            button.removeClass( "active" );
            box.hide();
        }
    });
});

/*
=====================================================================
*   Sign Out Form
===================================================================== 
*/
$(function() {
    $( ".logout" ).on( "click", () => {
        alert ("Due to technical difficulties, you will never Sign Out!!\nEVER AGAIN!! Muhahahahaha ")
    });
});

/*
=====================================================================
*   Add Event Form
===================================================================== 
*/
$(function() {
    var button = $( "#addButton" );
    var box    = $( "#eventBox" );
    var form   = $( "#eventForm" );
    button.removeAttr( "href" );
    button.mouseup( function( event ) {
        box.toggle();
        button.toggleClass( "active" );
    });
    form.mouseup( function() { 
        return false;
    });
    $( this ).mouseup( function( event ) {
        if( !( $( event.target ).parent( "#addButton" ).length > 0 ) ) {
            button.removeClass( "active" );
            box.hide();
        }
    });
});

/*
=====================================================================
*   Add Event Button - Function
===================================================================== 
*/
$(function() {
    var button = $( ".add-event" );
    var box    = $( "#eventBox" );
    
    $( ".add-event" ).on( "click", function( event ) {
        if( !( $( event.target ).parent( "#addButton" ).length > 0 ) ) {
            // Get the text the user types into the input field
            var eventInput = $( "#event-input" ).val().trim();

            if( eventInput.length > 0 ) {
                // Add the new Event into the events array
                eventsObject.events.push( eventInput );

                // Clear all Inputs
                $( "#event-input" ).val("");

                // Get the Current Date
                var dateEvent = formatDate();
                eventsObject.date.push( dateEvent );

                // Keep the information in LocalStorage
                storeEvent ();
            }

            // Hide the Event Form
            button.removeClass( "active" );
            box.hide();
        }
    });
});

/*
=====================================================================
*   Remove Event Button - Function
===================================================================== 
*/
$(function() {
    $("img[id=removebutton]").click( function() {
        $( document ).on( "click", ".event_volatile", removeEvents);
    })
});


/*
=====================================================================
*   General Functions
===================================================================== 
*/
function renderEvents () {
    getCalendar();

    var countEvents = parseInt( localStorage.getItem( "max_events" ) );
    countEvents     = ( ( countEvents <= 0 ) || ( isNaN( countEvents ) ) || ( typeof countEvents === "undefined" ) ) ? /* storeEventDefault() */ 0 : countEvents;
    
    if ( ( countEvents > 0 ) ) {
        var spanTag = "";
        var liTag   = "";
        var pTag    = "";
        var sentence;

        for ( let i = 0; i < countEvents; i++ ) {
            sentence = "";

            eventsObject.events.push( localStorage.getItem( "event_" + i ) );
            eventsObject.date.push( localStorage.getItem( "date_" + i ) );

            spanTag  = $( "<span>" ).append( eventsObject.date[ i ] );
            pTag     = $( "<p>" ).attr( "class", "remove-event" ).append( $( "<img>" ).attr( "id", "removebutton" ).attr( "src", "./icons/sign_remove.png" ).attr( "alt", "Delete Event" ) );
           
            sentence = searchSpecialCharacters( eventsObject.events[ i ] );

            liTag    = $( "<li>" ).attr( "id", "event-" + i ).attr( "class", "event_volatile" ).append( sentence ).append( spanTag ).append( pTag );

            $( ".events_ul" ).append( liTag );
        }
    }

    // For now they are equal to ZERO
    var countInvites   = parseInt( localStorage.getItem( "max_invites" ) );
    var countFavorites = parseInt( localStorage.getItem( "max_favotites" ) );

    iniciateArticlesList( countInvites, countFavorites, countEvents );
}

function getCalendar() {
    var d = new Date();

    // Get Month
    var fullMonth = calendar.fullMonth[ d.getMonth() ];
    $(".calendar-month").append( fullMonth );

    // Get Current Date
    $(".current-date").append( d.getDate() ).append( $("<em>" ).append( getOrdinalSuffix( d.getDate() ) ) );

    // Get the Day of the Week
    var dayOfWeek = calendar.fullDayOfWeek[ d.getDay() ];
    $(".calendar-button").append( dayOfWeek );
}

function getOrdinalSuffix (currentDate) {
    var cDate1 = currentDate % 10,
        cDate2 = currentDate % 100;

    return ( ( cDate1 == 1 && cDate2 != 11 ) ? "st" : ( ( cDate1 == 2 && cDate2 != 12 ) ? "nd" : ( ( cDate1 == 3 && cDate2 != 13 ) ? "rd" : "th" ) ) );
}

function iniciateArticlesList ( maxInvites, maxFavorites, maxEvents) {

    // Show the number of invites the user has
    $( ".red" ).append( ( ( maxInvites <= 0 )     || ( isNaN( maxInvites ) )   || ( typeof maxInvites   === "undefined" ) ) ? "0" : maxInvites );
    // Show the number of favorite events the user has
    $( ".green" ).append( ( ( maxFavorites <= 0 ) || ( isNaN( maxFavorites ) ) || ( typeof maxFavorites === "undefined" ) ) ? "0" : maxFavorites );
    // Show the number of events the user has
    $( ".yellow" ).append( ( ( maxEvents <= 0 )   || ( isNaN( maxEvents ) )    || ( typeof maxEvents    === "undefined" ) ) ? "0" : maxEvents );
}
/*
function storeEventDefault() {
    // Store DEFAULT event
    localStorage.setItem( "event_0", "Event Hint: My @homework5 is finally #done!!" );
    localStorage.setItem( "date_0", "01/01/0001 - 01:01:01" );
    localStorage.setItem( "max_events", 1 );

    return 1;
}
*/
function storeEvent() {
    var maxCount;
    eventsObject.events.forEach( ( item, index ) => {
    // for (let index = 0; index < eventsObject.events.length; index++) {
        // Store event
        maxCount = index + 1;
        localStorage.setItem( "event_" + index, eventsObject.events[ index ] );
        localStorage.setItem( "date_"  + index, eventsObject.date[ index ] );
        localStorage.setItem( "max_events", maxCount );
    });
}

function formatDate()
{
   var result = "";
   var d      = new Date();

   var dia = d.getDay();
   var mes = d.getMonth();

   result    += d.getFullYear() + "/" + 
                ( ( d.getMonth() + 1 ) < 10 ? "0" + ( d.getMonth() + 1 ) : ( d.getMonth() + 1 ) ) + "/" +
                ( d.getDate() < 10 ? "0" + d.getDate() : d.getDate() ) + 
                " - " +
                ( d.getHours()   < 10 ? "0" + d.getHours()   : d.getHours() )   + ":" + 
                ( d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes() ) + ":" + 
                ( d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds() );

   return result;
}

function searchSpecialCharacters( sentenceInput ) {
    if( ( sentenceInput.match( "@" ) ) || ( sentenceInput.match( "#" ) ) ) {
        var specialChar = "";
        var mySentence  = "";
        var format      = /[ `!$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/;
        var specialFlag = false;

        for( let i = 0; i < sentenceInput.length; i++ ) {
            if( specialFlag || ( sentenceInput[ i ] === "@" ) || ( sentenceInput[ i ] === "#" ) ) {
                specialFlag = true;

                if( !sentenceInput[ i ].match(format) )
                    specialChar += sentenceInput[ i ];
                else {
                    specialFlag = false;
                    mySentence += "<a href=''>" + specialChar + "</a>";
                    mySentence += sentenceInput[ i ];

                    // Clean the variable
                    specialChar  = "";
                }
            }
            else
                mySentence += sentenceInput[ i ];
        }

        // Just in case the sentence reach the end but the Special Character Sentence was not added to "mySentence"
        if ( specialFlag ) {
            specialFlag = false;
            mySentence += "<a href=''>" + specialChar + "</a>";
        }

        return mySentence;
    }
    else
        return sentenceInput;
}

function removeEvents() {

    // Get the sppecific Index of the event
    var indexOfEvent = parseInt( ( $( this ).attr( "id" ) ).slice( 6 ) );

    // Removing from HTML
    var eventIndex = "li:eq(" + indexOfEvent + ")";
    $(eventIndex).remove();

    // Erasing object
    delete eventsObject.events;
    delete eventsObject.date;
            
    var countEvents = parseInt( localStorage.getItem( "max_events" ) );
    var fixPosition = 0;
    for (let i = 0; i < countEvents; i++) {
        if( i === indexOfEvent ) {
            // localStorage.removeItem("name of localStorage variable you want to remove");
            localStorage.removeItem("event_" + indexOfEvent);
            localStorage.removeItem("date_"  + indexOfEvent);
        }
        else {
            localStorage.setItem( "event_" + fixPosition, localStorage.getItem( "event_" + i ) );
            localStorage.setItem( "date_"  + fixPosition, localStorage.getItem( "date_"  + i ) );
            fixPosition++;
        } 
    }
    // Correct the Total of Events
    localStorage.setItem( "max_events", --countEvents );

    // Remove last child of Local Storage
    localStorage.removeItem("event_" + countEvents);
    localStorage.removeItem("date_"  + countEvents);

    // Reload webpage
    window.location.href = "index.html";
}


/*
=====================================================================
*   Build webpage
===================================================================== 
*/
    // localStorage.clear();
    renderEvents ();
})