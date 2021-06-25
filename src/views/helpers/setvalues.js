// Attempt to use a value if it exists, otherwise use a default
// Helps avoid lengthy if/else statements such as: {{#if this.type}}{{this.type}}{{else}}{{@root.classification_release.[1]}}{{/if}}
// Usage: {{setvalues valueToUseIfExists defaultValueToUseIfNull}}
// Ex: {{setvalues this.type @root.classification_release.[1]}}
// If {{this.type}} is set, then it will be used, otherwise fall back on the default of @root.classification_release.[1]
export default function (val,defaultVal){
  var useVal = val || defaultVal;
  return useVal;
};