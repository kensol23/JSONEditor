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

var test_schema = {
  "title": "Retrieve List of Items in Shopping Bag response",
  "type": "object",
  "properties": {
    "actions": {
      "type": "array",
      "items": {
        "title": "Action",
        "type": "object",
        "properties": {
          "href": {
            "type": "string"
          },
          "method": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "title": {
            "type": "string"
          }
        },
        "required": [
          "href",
          "method",
          "name",
          "title"
        ]
      }
    },
    "links": {
      "type": "array",
      "items": {
        "title": "Link",
        "type": "object",
        "properties": {
          "href": {
            "type": "string"
          },
          "rel": {
            "type": "string"
          }
        },
        "required": [
          "href",
          "rel"
        ]
      }
    },
    "properties": {
      "title": "Properties",
      "type": "object",
      "properties": {
        "items": {
          "type": "array",
          "items": {
            "title": "Item",
            "type": "object",
            "properties": {
              "actions": {
                "type": "array",
                "items": {
                  "title": "Action",
                  "type": "object",
                  "properties": {
                    "href": {
                      "type": "string"
                    },
                    "method": {
                      "type": "string"
                    },
                    "name": {
                      "type": "string"
                    },
                    "title": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "href",
                    "method",
                    "name",
                    "title"
                  ]
                }
              },
              "attributes": {
                "type": "array",
                "items": {
                  "title": "Attribute",
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "number",
                      "format": "double"
                    },
                    "name": {
                      "type": "string"
                    },
                    "value": {
                      "type": "string"
                    },
                    "valueId": {
                      "type": "number",
                      "format": "double"
                    }
                  },
                  "required": [
                    "id",
                    "name",
                    "value",
                    "valueId"
                  ]
                }
              },
              "description": {
                "type": "string"
              },
              "itemId": {
                "type": "number",
                "format": "double"
              },
              "itemQuantity": {
                "type": "number",
                "format": "double"
              },
              "imageURL": {
                "type": "string"
              },
              "links": {
                "type": "array",
                "items": {
                  "title": "Link",
                  "type": "object",
                  "properties": {
                    "href": {
                      "type": "string"
                    },
                    "rel": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "href",
                    "rel"
                  ]
                }
              },
              "orderItemId": {
                "type": "number",
                "format": "double"
              },
              "orderItemPrice": {
                "type": "number",
                "format": "double"
              },
              "productId": {
                "type": "number",
                "format": "double"
              },
              "catEntryId": {
                "type": "number",
                "format": "double"
              },
              "regularPrice": {
                "type": "number",
                "format": "double"
              },
              "seqNumber": {
                "type": "number",
                "format": "double"
              },
              "services": {
                "type": "array",
                "items": {
                  "title": "Service",
                  "type": "object",
                  "properties": {
                    "attributes": {
                      "type": "array",
                      "items": {
                        "title": "Attribute9",
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "number",
                            "format": "double"
                          },
                          "name": {
                            "type": "string"
                          },
                          "value": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "id",
                          "name",
                          "value"
                        ]
                      }
                    },
                    "cost": {
                      "type": "number",
                      "format": "double"
                    },
                    "id": {
                      "type": "number",
                      "format": "double"
                    },
                    "name": {
                      "type": "string"
                    },
                    "oapSavings": {
                      "type": "number",
                      "format": "double"
                    },
                    "promoSaving": {
                      "type": "number",
                      "format": "double"
                    }
                  },
                  "required": [
                    "attributes",
                    "cost",
                    "id",
                    "name",
                    "oapSavings",
                    "promoSaving"
                  ]
                }
              }
            },
            "required": [
              "attributes",
              "description",
              "itemId",
              "itemQuantity",
              "imageURL",
              "links",
              "orderItemId",
              "orderItemPrice",
              "productId",
              "catEntryId",
              "regularPrice",
              "seqNumber"
            ]
          }
        },
        "orderFinancial": {
          "title": "OrderFinancial",
          "type": "object",
          "properties": {
            "discountedMerchandiseTotal": {
              "type": "number",
              "format": "double"
            },
            "duties": {
              "type": "number",
              "format": "double"
            },
            "estimatedBalance": {
              "type": "number",
              "format": "double"
            },
            "estimatedOrderTotal": {
              "type": "number",
              "format": "double"
            },
            "estimatedShipping": {
              "type": "number",
              "format": "double"
            },
            "estimatedSubTotal": {
              "type": "number",
              "format": "double"
            },
            "giftCardTotal": {
              "type": "number",
              "format": "double"
            },
            "isTaxServiceDown": {
              "type": "boolean"
            },
            "itemsInShoppingCart": {
              "type": "number",
              "format": "double"
            },
            "llbeanVisaCoupon": {
              "type": "number",
              "format": "double"
            },
            "llbeanVisaSavings": {
              "type": "number",
              "format": "double"
            },
            "merchandiseMarkdownTotal": {
              "type": "number",
              "format": "double"
            },
            "merchandiseSavings": {
              "type": "number",
              "format": "double"
            },
            "merchandiseTotal": {
              "type": "number",
              "format": "double"
            },
            "orderSavingsTotal": {
              "type": "number",
              "format": "double"
            },
            "oversizedDeliveryCharge": {
              "type": "number",
              "format": "double"
            },
            "promotionalGiftCard": {
              "type": "number",
              "format": "double"
            },
            "shippingDiscountTotal": {
              "type": "number",
              "format": "double"
            },
            "showTaxDuty": {
              "type": "boolean"
            },
            "taxDutiesTotal": {
              "type": "number",
              "format": "double"
            },
            "taxTotal": {
              "type": "number",
              "format": "double"
            }
          },
          "required": [
            "discountedMerchandiseTotal",
            "duties",
            "estimatedBalance",
            "estimatedOrderTotal",
            "estimatedShipping",
            "estimatedSubTotal",
            "giftCardTotal",
            "isTaxServiceDown",
            "itemsInShoppingCart",
            "llbeanVisaCoupon",
            "llbeanVisaSavings",
            "merchandiseMarkdownTotal",
            "merchandiseSavings",
            "merchandiseTotal",
            "orderSavingsTotal",
            "oversizedDeliveryCharge",
            "promotionalGiftCard",
            "shippingDiscountTotal",
            "showTaxDuty",
            "taxDutiesTotal",
            "taxTotal"
          ]
        },
        "orderId": {
          "type": "number",
          "format": "double"
        }
      },
      "required": [
        "items",
        "orderFinancial",
        "orderId"
      ]
    }
  },
  "required": [
    "actions",
    "links",
    "properties"
  ]
};

var json = {
  "array": [1, 2, 3],
  "boolean": true,
  "null": null,
  "number": 123,
  "object": { "a": "b", "c": "d" },
  "string": "Hello World"
};

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