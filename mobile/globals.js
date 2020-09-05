// next.js tries to find the window.location.protocol, with this we can prevent the error from happening 
global.window = {
    ...window,
    location: {
        protocol: ''
    }
}