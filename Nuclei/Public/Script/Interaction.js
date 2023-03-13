// Max van Leeuwen
// twitter.com/maksvanleeuwen
//
// Interaction



//@input Component.ObjectTracking3D bodyTracking
//@input Component.VFXComponent VFXComponent
//@input Asset.Material body
//@input Component.RenderMeshVisual[] bodyRMV



// initialize
function init(){
    // clone body material for each position channel (x, y, z), increment ch and apply to mesh
    for(var i = 0; i < script.bodyRMV.length; i++){
        var newMat = script.body.clone();
        newMat.mainPass.ch = i;
        script.bodyRMV[i].addMaterial(newMat);
    }
}
init();



// start
function start(){
    new global.DoDelay(startPositionBind).byFrame(5); // start particles and position binding after a few frames (arbitrary amount)
}
start();



function startPositionBind(){
    // get the body and vfx component transforms
    var bodyTrf = script.bodyTracking.getTransform();
    var vfxTrf = script.VFXComponent.getTransform();

    // keep track of whether the body tracking was active on the previous frame
    var wasTracking = false;
    
    function positionBind(){
        // update body mesh (fixes world tracking/body tracking misalignment)
        vfxTrf.setWorldPosition(bodyTrf.getWorldPosition());
        vfxTrf.setWorldRotation(bodyTrf.getWorldRotation());

        // update positions on tracking change
        var isTracking = script.bodyTracking.isTracking();
        if(!wasTracking && isTracking) onTrackingStart(); // called once per tracking found
        wasTracking = isTracking;
    }
    var positionBindEvent = script.createEvent('UpdateEvent');
    positionBindEvent.bind(positionBind);
}



function onTrackingStart(){
    // start reveal effect in vfx asset
    script.VFXComponent.asset.properties.startReveal = getTime() + .4; // arbitrary time offset, looks nicer
}