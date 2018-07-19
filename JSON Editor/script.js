/**
 * @param {Object} json - JSON to be validated.
 * @param {Object} schema - JSON Schema
 * @param {HTMLElement} container - HTML Container
 */
var validateSchema = function (json, schema, container) {
  //remove childs from container
  clearContainer(container);

  //execute schema validation and store result in a variable
  var validate = tv4.validateMultiple(json, schema);
  if (!validate.valid) {

    //create a table for the error list
    var errorList = document.createElement("table");
    errorList.setAttribute("id", "errorList");

    //add table header
    var tableHeader  = newElement("thead"),
        headerRow    = newElement("tr"),
        headerTitle1 = newElement("th"),
        headerTitle2 = newElement("th"),
        headerTitle3 = newElement("th");
    //
    headerRow.appendChild(headerTitle1).appendChild(createText("ERROR MESSAGE"));
    headerRow.appendChild(headerTitle2).appendChild(createText("DATA PATH"));
    headerRow.appendChild(headerTitle3).appendChild(createText("SCHEMA PATH"));
    //
    tableHeader.appendChild(headerRow);
    tableHeader.setAttribute("class", "errorListHeader");
    
    //create table body
    tableBody = newElement("tbody");
    tableBody.setAttribute("height", "100px");
    //append header and body to table
    errorList.appendChild(tableHeader);
    errorList.appendChild(tableBody);

    //iterate over array of errors to add elements to the list
    for (e in validate.errors) {
      
      //setup schemaPath and dataPath attributes for the errorListRowX elements
      var schemaPath = validate.errors[e].schemaPath;
      if (schemaPath) {
        if (schemaPath.charAt(0) === '/') schemaPath = schemaPath.slice(1);
      }else{
        schemaPath = "";
      }
      var dataPath = validate.errors[e].dataPath;
      if (dataPath) {
        if (dataPath.charAt(0) === '/')  dataPath = dataPath.slice(1);
      }else{
        dataPath = "";
      }

      //create error row
      var errorListRow = newElement("tr");
      errorListRow.setAttribute("dataPath", dataPath);
      errorListRow.setAttribute("schemaPath", schemaPath);
      errorListRow.onclick = highLightError;//append onClick event to table row

      //create cell elements
      var messageData = newElement("td");
          messageData.appendChild(document.createTextNode(validate.errors[e].message));
      //
      var dataPathData = newElement("td");
          dataPathData.appendChild(document.createTextNode(validate.errors[e].dataPath));
      //
      var schemaPathData = newElement("td");
          schemaPathData.appendChild(document.createTextNode(validate.errors[e].schemaPath));

      //append cell elements to row
      errorListRow.appendChild(messageData);
      errorListRow.appendChild(dataPathData);
      errorListRow.appendChild(schemaPathData);

      //append row to table body and to table
      errorList.appendChild(tableBody).appendChild(errorListRow);
    }

    //create a section header
    var errorHead = document.createElement("h3");
        errorHead.appendChild(document.createTextNode("SCHEMA VALIDATION ERRORS"));

    //append elements to container
    container.appendChild(errorHead);
    container.appendChild(errorList);
  }
},
/**
 * @param {string} selector - CSS Selector.
 */
$ = function (selector) {
  return document.querySelector(selector);
},
/**
 * @param {string} e - Element name.
 */
newElement = function(e){
  return document.createElement(e);
},
/**
 * @param {string} text - Text value.
 */
createText = function (text){
  return document.createTextNode(text);
},

highLightError = function () {
  let a = event.currentTarget.getAttribute("schemapath"),
      b = event.currentTarget.getAttribute("datapath");

  if (a) {
    var startSchema = { "path": getNodePath(a) };
    console.log(JSON.stringify(startSchema,3));
    schemaEditor.setMode('tree');
    schemaEditor.setSelection(startSchema);
  }
  if (b) {
    var startData = { "path": getNodePath(b) };
    console.log(JSON.stringify(startData,3));
    treeEditor.setSelection(startData);
  }
},

getNodePath = function (path) {
  if(path){
    return path.split('/');
  }else{
    return [];
  }
},

clearContainer = function(container){
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

var codeContainer   = $('#codeEditor');
var treeContainer   = $('#treeEditor');
var schemaContainer = $('#schemaEditor');
var footerContainer = $('#footerContent');

var test_schema = {};
var json = {};

var codeOptions = {
  mode: 'code',
  onError: function (err) {
    alert(err.toString());
  },
  onChange: function () {
    try{
      treeEditor.set(codeEditor.get());
      validateSchema(codeEditor.get(), schemaEditor.get(), footerContainer);
    }catch(e){
      clearContainer(footerContainer);
    }
  }
};

var treeOptions = {
  mode: 'tree',
  onError: function (err) {
    alert(err.toString());
  },
  onChange: function () {
    try{
      codeEditor.set(treeEditor.get());
      validateSchema(codeEditor.get(), schemaEditor.get(), footerContainer);
    }catch(e){
      clearContainer(footerContainer);
    }
  }
};

var schemaOptions = {
  mode: 'code',
  modes: ['code', 'form', 'text', 'tree', 'view'], // allowed modes
  onError: function (err) {
    alert(err.toString());
  },
  onModeChange: function (newMode, oldMode) {
    console.log('Mode switched from', oldMode, 'to', newMode);
  },
  onChange: function () {
    try{
      validateSchema(codeEditor.get(), schemaEditor.get(), footerContainer);
      var start = { "path": ["object", "a"] };
      treeEditor.setSelection(start);
    }catch(e){
      clearContainer(footerContainer);
    }
  }
};

var codeEditor   = new JSONEditor(codeContainer, codeOptions, json);
var treeEditor   = new JSONEditor(treeContainer, treeOptions, json);
var schemaEditor = new JSONEditor(schemaContainer, schemaOptions, test_schema);


/*document.getElementById('btn_totree').onclick = function () {
let json = editor_1.get();
editor_0.set(json);
};*/