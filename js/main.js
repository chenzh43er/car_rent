'use strict';
const applicationServerPublicKey='BCMAQzkFAxXMdqC2-aMpEsZv793LIh06KbQsO4GgoobQPy680hgXZMoaAHhG3Mg8FWo1UBXFDzVEgZmmYIu3Cbs';
let isSubscribed=false;
let swRegistration=null;
let ips=address;
var $backdrop = document.getElementById("popup-back")
let host = self.location.host;
let sites;
console.log(host);
let pre_site = host.substring(0, host.indexOf('.'))
console.log(pre_site);
if (pre_site == 'auto') {
    sites = 'carslyst_auto'
}else if (pre_site == 'car') {
    sites = 'carslyst_car'
}else {
    sites = 'carslyst'
}
function showBackDrop() {
    if (document.body.clientWidth >= 1025 && subTipNumber >= 2 && !isClickBackTopDouble) {
        $("#popup-back").show()
    }
}
function urlB64ToUint8Array(a){
    const padding='='.repeat((4-a.length%4)%4);
    const base64=(a+padding).replace(/\-/g,'+').replace(/_/g,'/');
    const rawData=window.atob(base64);
    const outputArray=new Uint8Array(rawData.length);
    for(let i=0;i<rawData.length;++i){
        outputArray[i]=rawData.charCodeAt(i)
    }
    return outputArray
}
function toSubscribed() {
    if('serviceWorker'in navigator&&'PushManager'in window){
        console.log('Service Worker and Push is supported');
        navigator.serviceWorker.register('/sw.js?v-4').then(function(a){
            console.log('Service Worker is registered',a);
            swRegistration=a;
            initialiseUI()
        }).catch(function(a){
            console.error('Service Worker Error',a)
        })
    }else{
        console.warn('Push messaging is not supported')
    }
}
function initialiseUI(){
    swRegistration.pushManager.getSubscription().then(function(a){
            isSubscribed=!(a===null);
            if(isSubscribed){
                console.log('User IS subscribed.');
                return
            }else if (Notification.permission === 'denied') {
                console.log('User IS denied.');
            } else {
                subscribeUser();
                // showBackDrop();
                console.log('User is NOT subscribed.')
            }
        }
    )}
function updateBtn() {
    $backdrop.style.display = "none"
    if(Notification.permission==='denied'){
        updateSubscriptionOnServer(null);
        return
    }
}
function subscribeUser() {
    const applicationServerKey=urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
        userVisibleOnly:true,applicationServerKey:applicationServerKey
    })
        .then(function (a) {
            console.log('User is subscribed:',a);
            updateSubscriptionOnServer(a);
            isSubscribed = true;
            updateBtn()
        })
        .catch(function (a) {
            console.log('Failed to subscribe the user: ',a);
            updateBtn()
        });
    let e = {
        site: sites
    };
    fetch("https://push.silversiri.com/subimpression", {
        mode: "no-cors",
        body: JSON.stringify(e),
        method: "POST",
        headers: {
            'content-type': 'application/json'
        }
    }).then(function(e) {
        console.log(e);
        return;
    })
}
function updateSubscriptionOnServer(a){
    var b=JSON.stringify(a);
    var c=JSON.parse(b);
    mailAjax(c.endpoint,c.keys.auth,c.keys.p256dh)
}
function mailAjax(b,c,d){
    var e=window.location.href;
    var f={
        "endpoint":b,
        "auth":c,
        'p256dh':d,
        'site':sites,
        'url':e,
        'ips':ips
    };
    $.ajax({
        type:"POST",
        url:"https://push.silversiri.com/subscribe",
        dataType:"json",
        crossDomain:true,
        data:f,
        success:function(a){
            console.log(a)
        }
    })
}