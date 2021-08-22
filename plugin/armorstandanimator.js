(function(){
    // Credit to https://github.com/misode/ (cf. https://github.com/misode/vscode-nbt/blob/master/src/common/Snbt.ts)
    function stringify(t,e,n=""){const r=n+" ";switch(t){case"compound":return 0===Object.keys(e).length?"{}":`{\n${Object.entries(e).map(([t,e])=>`${r}"${t}": ${stringify(e.type,e.value,r)}`).join(",\n")}\n${n}}`;case"list":return 0===e.value.length?"[]":isCompact(e.type)?`[${stringifyEntries(e.type,e.value,"",", ")}]`:`[\n${stringifyEntries(e.type,e.value,r,",\n")}\n${n}]`;case"byteArray":return`[B;${stringifyEntries("byte",e," ",",")}]`;case"intArray":return`[I;${stringifyEntries("int",e," ",",")}]`;case"longArray":return`[L;${stringifyEntries("long",e," ",",")}]`;case"floatArray":return`[${stringifyEntries("float",e,",")}]`;case"string":return'"'+e.replace(/(\\|")/g,"\\$1")+'"';case"byte":return e+"b";case"double":return e+"d";case"float":return e+"f";case"short":return e+"s";case"int":return""+e;case"long":return stringifyLong(e)+"L";default:return"null"}}function stringifyLong(t){return dataView.setInt32(0,Number(t[0])),dataView.setInt32(4,Number(t[1])),""+dataView.getBigInt64(0)}function stringifyEntries(t,e,n,r){return e.map(e=>`${n}${stringify(t,e,n)}`).join(r)}function isCompact(t){return"byte"===t||"double"===t||"float"===t||"short"===t||"int"===t||"long"===t}bytes=new Uint8Array(8),dataView=new DataView(bytes.buffer);
    
    var menu;
    
    Plugin.register('armorstandanimator', {
        title: "Armor Stand Animator",
        description: "Blockbench plugin used to help Minecraft creators animating armor stands in the game.",
        author: "JeffWooden",
        version: "0.5",
        icon: "animation",
        variant: "both",
        onload(){
            menu = new BarMenu("asa")
            menu.label.innerText = "Armorstand Animator"
        },
        onunload(){
            // menu.delete()
        }
    })
})();