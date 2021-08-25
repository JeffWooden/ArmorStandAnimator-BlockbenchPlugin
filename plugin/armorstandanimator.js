function warnUser(msg,time,link="",color="#f05664"){return Blockbench.showToastNotification({text:msg,expire:time,color:color,click(){if(link)return Blockbench.openLink(link)}})}
function getArray(data_point){return[data_point.x*-1,data_point.y,data_point.z*-1]}
function roundTime(time){return Math.floor(time*20)}

(function(){
    // Credit to https://github.com/misode/ (cf. https://github.com/misode/vscode-nbt/blob/master/src/common/Snbt.ts)
    function stringify(t,e){switch(t){case"compound":return 0===Object.keys(e).length?"{}":`{${Object.entries(e).map(([t,e])=>`${t}:${stringify(e.type,e.value)}`).join(",")}}`;case"list":return 0===e.value.length?"[]":(isCompact(e.type),`[${stringifyEntries(e.type,e.value,",")}]`);case"byteArray":return`[B;${stringifyEntries("byte",e,",")}]`;case"intArray":return`[I;${stringifyEntries("int",e,",")}]`;case"longArray":return`[L;${stringifyEntries("long",e,",")}]`;case"floatArray":return`[${stringifyEntries("float",e,",")}]`;case"string":return'"'+e.replace(/(\\|")/g,"\\$1")+'"';case"byte":return e+"b";case"double":return e+"d";case"float":return e+"f";case"short":return e+"s";case"int":return""+e;case"long":return stringifyLong(e)+"L";default:return"null"}}function stringifyLong(t){return dataView.setInt32(0,Number(t[0])),dataView.setInt32(4,Number(t[1])),""+dataView.getBigInt64(0)}function stringifyEntries(t,e,r){return e.map(e=>`${stringify(t,e)}`).join(r)}function isCompact(t){return"byte"===t||"double"===t||"float"===t||"short"===t||"int"===t||"long"===t}
    
    var config = {
        warn : 4000
    }

    var menu;
    var load_as_button;
    var export_button;
    
    Plugin.register('armorstandanimator', {
        title: "Armor Stand Animator",
        description: "Blockbench plugin used to help Minecraft creators animating armor stands in the game.",
        author: "JeffWooden",
        version: "0.5",
        icon: "animation",
        variant: "both",
        onload(){
            // Onload message
            console.log("%cArmorStand Animator", "padding: 4px 8px;background: linear-gradient(to right bottom, #1e93d9, #00b1e2, #00ccd2, #20e2af, #9ef188, #f9f871);font-size: 1.2em;color: black;border: 2px solid #edfbff;border-radius: 5px;")
            // Warn the user if its project doesn't contain an animation mode.
            events = ["new_project","open_project"].forEach((evt) => {Blockbench.on(evt, () => {
                warnUser(`Please, make sure your current project have an "animate" mode. If not, the "ArmorStandAnimator" plugin will not work.`, config.warn, undefined, "#00b7ff")
            })})
            // Create buttons
            load_as_button = new Action("load_as",{name:"Load Armorstand Model",description:"",icon:"add_circle_outline",click:function()
            {
                // Credit to https://github.com/DoubleF3lix/Armor-Stand-Animator/blob/main/plugins/armor_stand_animator.js#L154
                let armorStand=new Group({name:"armor_stand",origin:[0,0,0],isOpen:!0}).init(),headBone=new Group({name:"head_bone",origin:[0,21.5,0],isOpen:!0}).addTo(armorStand).init(),headCube=new Cube({name:"head",from:[-1,23,-1],to:[1,29,1],isOpen:!0,color:3}).addTo(headBone).init(),leftArmBone=new Group({name:"left_arm_bone",origin:[6.25,21.25,0],isOpen:!0}).addTo(armorStand).init(),leftArmCube=new Cube({name:"left_arm",from:[5,11,-1],to:[7,23,1],isOpen:!0,color:5}).addTo(leftArmBone).init(),rightArmBone=new Group({name:"right_arm_bone",origin:[-6.25,21.25,0],isOpen:!0}).addTo(armorStand).init(),rightArmCube=new Cube({name:"right_arm",from:[-7,11,-1],to:[-5,23,1],isOpen:!0,color:1}).addTo(rightArmBone).init(),bodyBone=new Group({name:"body_bone",origin:[0,23.5,0],isOpen:!0}).addTo(armorStand).init(),leftRibCube=new Cube({name:"left_rib",from:[1,13,-1],to:[3,20,1],isOpen:!0,color:7}).addTo(bodyBone).init(),rightRibCube=new Cube({name:"right_rib",from:[-3,13,-1],to:[-1,20,1],isOpen:!0,color:7}).addTo(bodyBone).init(),collarCube=new Cube({name:"collar",from:[-6,20,-1.5],to:[6,23,1.5],isOpen:!0,color:7}).addTo(bodyBone).init(),hipCube=new Cube({name:"hip",from:[-4,11,-1],to:[4,13,1],isOpen:!0,color:7}).addTo(bodyBone).init(),leftLegBone=new Group({name:"left_leg_bone",origin:[2,12,0],isOpen:!0}).addTo(armorStand).init(),leftLegCube=new Cube({name:"left_leg",from:[1,0,-1],to:[3,11,1],isOpen:!0,color:0}).addTo(leftLegBone).init(),rightLegBone=new Group({name:"right_leg_bone",origin:[-2,12,0],isOpen:!0}).addTo(armorStand).init(),rightLegCube=new Cube({name:"right_leg",from:[-3,0,-1],to:[-1,11,1],isOpen:!0,color:2}).addTo(rightLegBone).init();
            }});
            export_button = new Action("export",{name:"Export Animation",description:"",icon:"engineering",click:function()
            {
                // Check all the prerequisites: animate mode opened, an animation selected, its snapping value to 20 FPS, a convetion approved namespace.
                if(Mode.selected.id != "animate") return warnUser(`You've to open the "Animate" mode before exporting the animation.`, config.warn)

                selectedAnimation = Animator.selected
                if(selectedAnimation == null) return warnUser(`Please, select an animation before.`, config.warn)

                if(selectedAnimation.snapping != 20) return warnUser(`Invalid snapping number ! Please, set the animation snapping to "20"`, config.warn)

                if(!/^([a-z0-9-_\.]+)$/.test(selectedAnimation.name)) return warnUser(`Your animation name doesn't respect namespace conventions... Click to see more.`, 8000, "https://minecraft.fandom.com/wiki/Resource_location#Java_Edition")
                
                // Collects and formats all the keyframes into an object. Each key corresponds to a specific keyframe in the timeline.
                let keyframes = {}
                Object.values(selectedAnimation.animators).forEach(bone => {
                    boneName = bone.name.replace(/_bone/, '')
                    // Collects the rotation keyframes if the animation contains any.
                    if(bone.rotation.length >= 1){
                        bone.rotation.forEach(keyframe => {
                            time = roundTime(keyframe.time)
                            rotation = getArray(keyframe.data_points[0]).map(n => parseFloat(n).toFixed(2))
                            keyframes[time] ??= {}
                            if(boneName!="armor_stand"){keyframes[time][boneName] = rotation}else{keyframes[time][boneName] ??= {}; keyframes[time][boneName].rotation = rotation} 
                        })
                    }
                    // Collects the position keyframes if the animation contains any.
                    if(boneName == "armor_stand" && bone.position.length >= 1){ // Only the armorstand can move freely in space whereas the limbs are stuck.
                        bone.position.forEach(keyframe => {
                            time=roundTime(keyframe.time),keyframes[time]??={},keyframes[time][boneName]??={};
                            keyframes[time][boneName].position = getArray(keyframe.data_points[0]).map(n => -1*parseFloat(n).toFixed(2))
                            keyframes[time][boneName].position[1] *= -1
                        })
                    }
                })

                // Create the output component, which register the keyframes in a readable langage for the datapack.
                let output = {value:[],type:"compound"}
                currentTime = 0
                startDelay = (selectedAnimation.start_delay != "") ? parseFloat(selectedAnimation.start_delay) : 0
                if(startDelay>0) output.value.push({delay:{type:"int",value:roundTime(startDelay)}})
                loopDelay = eval(selectedAnimation.loop_delay)
                for([time,bone] of Object.entries(keyframes)){ // It iterates through the keyframes and bones.
                    entry = {}
                    poseNbt = {}
                    rotNbt = undefined;
                    posNbt = undefined;
                    for([bone,data] of Object.entries(bone)){ // It iterates through all the contained data.
                        if(bone != "armor_stand") {
                            poseNbt[bone.split("_").map(str => (str[0].toUpperCase() + str.substring(1))).join("")] = {type:"floatArray",value:data}
                        } else {
                            rotNbt = data.rotation
                            posNbt = data.position
                        }
                    }
                    // Finalized the translation by adding all the part in the output component.
                    if(time-currentTime > 1 && output.value.length >= 1) output.value[output.value.length-1].delay = {type:"int",value:time-currentTime}
                    if(Object.entries(poseNbt).length > 0) entry.Pose = {type:"compound",value:poseNbt}
                    if(rotNbt !== undefined) entry.Rot = {type:"float",value:rotNbt[1]}
                    if(posNbt !== undefined) entry.Pos = {type:"list",value:{type:"double",value:posNbt}}
                    output.value.push(entry)
                    currentTime = time
                }
                // Lastly, all the remaining settings go in the nbt component, which gathers them with the final output.
                nbt = {animation:{type:"compound", value:{}}}
                switch(selectedAnimation.loop){case"once":nbt.animation.value.resetToDefault={type:"int",value:1};break;case"loop":nbt.animation.value.looping={type:"int",value:1};if(loopDelay && output.value.length>=1)output.value[output.value.length-1].delay = {type:"int",value:roundTime(loopDelay)};break;default:break;}
                nbt.animation.value.keyframes = {type:"list",value:output}
                // Export module, it creates a .mcfunction file that load the animation into an armor_stand.
                Blockbench.export({
                    type:`${selectedAnimation.name}`,
                    extensions: [".mcfunction"],
                    content: `# This function command should be executed as the armor stand.\ndata merge storage jw:aa ${stringify("compound", nbt)}\nexecute as @s run function jw_aa:load_animation`
                })
            }});

            // Create pluginMenu bar and integrates button in it
            pluginMenu = new BarMenu("asa", [load_as_button,export_button])
            pluginMenu.label.innerText = "Armorstand Animator"
        },
        onunload(){
            // menu.delete()
        }
    })
})();