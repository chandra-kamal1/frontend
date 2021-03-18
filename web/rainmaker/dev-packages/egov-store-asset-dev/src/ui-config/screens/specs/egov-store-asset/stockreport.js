import {
  getCommonHeader,
  getCommonCard,
  getCommonContainer,
  getCommonParagraph,
  getLabelWithValue,
  getCommonTitle,
  getDateField,
  getLabel,
  getPattern,
  getSelectField,
  getTextField,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {    
  validateFields,  
} from "../utils";
//import { DOEApplyApplication} from "./applydoeResources/DOEApplyApplication";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getSearchPensioner,getPMSPattern } from "../../../../ui-utils/commons";
import { toggleSnackbar,toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getstoreTenantId } from "../../../../ui-utils/storecommonsapi";
import {
  getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import find from "lodash/find";
import set from "lodash/set";
import get from "lodash/get";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {  
  InventoryData
  } from "../../../../ui-utils/sampleResponses";
  import { httpRequest } from "../../../../ui-utils";
import { getSearchResults } from "../../../../ui-utils/commons"; 
import { getTodaysDateInYMD } from "../utils";
  const resetFields = (state, dispatch) => {
    const textFields = ["storeName","materialName",];
    for (let i = 0; i < textFields.length; i++) {
      if (
        `state.screenConfiguration.screenConfig.stockreport.components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.${textFields[i]}.props.value`
      ) {
        dispatch(
          handleField(
            "stockreport",
            `components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.${textFields[i]}`,
            "props.value",
            ""
          )
        );
      }
    }
    dispatch(prepareFinalObject("searchScreen", {}));
  }; 
const ActionSubmit = async (state, dispatch) => {
  let queryObject = [
  {
    key: "tenantId",
    value: getTenantId()
  }
 
];
let searchScreenObject = get(
  state.screenConfiguration.preparedFinalObject,
  "searchScreen",
  {}
);
const isProfessionalDetailsValid = validateFields(
  "components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children",
  state,
  dispatch,
  "stockreport"
);
if( Object.keys(searchScreenObject).length == 0 )
{
  const textFields = ["storeName","materialName","asOnDate"];
  for (let i = 0; i < textFields.length; i++) {
    if (
      `state.screenConfiguration.screenConfig.stockreport.components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.${textFields[i]}.props.value`
    ) {
      dispatch(
        handleField(
          "stockreport",
          `components.div.children.SearchCard.children.cardContent.children.appPRSearchContainer.children.${textFields[i]}`,
          "props.value",
          ""
        )
      );
    }
  }
  
  dispatch(prepareFinalObject("searchScreen", {}));
  dispatch(
    toggleSnackbar(
      true,
      {
        labelName: "Please fill at least one field to start search",
        labelKey: "ERR_FILL_ALL_FIELDS"
      },
      "warning"
    )
  );
}
else
{
  if(!isProfessionalDetailsValid)
  {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field to start search",
          labelKey: "ERR_FILL_ALL_FIELDS"
        },
        "warning"
      )
    );
  }
  else{
    for (var key in searchScreenObject) {  
  
      queryObject.push({ key: key, value: (searchScreenObject[key]) });
    }
    
    queryObject.push({
      key: "isprint",
      value: false
    });
    
    try {
      let payload =[];
    
     let Responce = await httpRequest(
        "post",
        "/store-asset-services/openingbalance/_stockReport",
        "_stockReport",    
        queryObject
      );
    
    payload = InventoryData()
    dispatch(prepareFinalObject("InventoryData", payload));
    if(get(Responce,"printData",[]))
    dispatch(prepareFinalObject("InventoryAPIData", get(Responce,"printData",[])));
    else
    {
     let  InventoryAPIData =[] 
     dispatch(prepareFinalObject("InventoryAPIData",InventoryAPIData));
    }
      console.log(payload)
    
    
      
    
    
    return payload
    
    } catch (e) {
      console.log(e);
    }

  }


}


}

export const getData = async (action, state, dispatch) => {
 
  await getMdmsData(state, dispatch);
  
   //fetching store name
   const queryObject = [{ key: "tenantId", value: getTenantId()  }];
   getSearchResults(queryObject, dispatch,"storeMaster")
   .then(response =>{
     if(response){
       const storeNames = response.stores.map(item => {
         let code = item.code;
         let name = item.name;
         let department = item.department.name;
         let divisionName = item.divisionName;
         return{code,name,department,divisionName}
       } )
       dispatch(prepareFinalObject("searchMaster.storeNames", storeNames));
     }
   });
};
const getMdmsData = async (state, dispatch) => {
  const tenantId =  getstoreTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "store-asset",
          masterDetails: [
            { name: "Material", },
           
          ],
        },
      ]
    }
  };
  try {
    const response = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    dispatch(prepareFinalObject("searchScreenMdmsData", get(response, "MdmsRes"))
    );

    return true;
  } catch (e) {
    console.log(e);
  }
};

const header = getCommonHeader({
  labelName: "Stock Aging Report",
  labelKey: "STORE_AGING_REPORT"
});
const RegisterReviewResult1 = {
  uiFramework: "material-ui",
  name: "stockreport",
  beforeInitScreen: (action, state, dispatch) => {
  //  resetFields(state, dispatch);
    const tenantId = getTenantId();   
    dispatch(prepareFinalObject("searchScreen",{}));
    let  InventoryAPIData =[] 
    dispatch(prepareFinalObject("InventoryAPIData",InventoryAPIData));
    getData(action, state, dispatch).then(responseAction => {
    
    }); 
       //get Eployee details data       
// prepareEditFlow(state, dispatch,  tenantId).then(res=>
//   {
//   }
// );
    
        return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "review"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6
              },
              ...header
            },
            
          }
        },
 
    SearchCard: getCommonCard({

      appPRSearchContainer: getCommonContainer({
        storeName: {
          ...getSelectField({
            label: { labelName: "Store Name", labelKey: "STORE_DETAILS_STORE_NAME" },
            placeholder: {
              labelName: "Select Store Name",
              labelKey: "STORE_DETAILS_STORE_NAME_SELECT"
            },
            required: true,
            jsonPath: "searchScreen.storecode",
            sourceJsonPath: "searchMaster.storeNames",
            errorMessage: "STORE_VALIDATION_STORE_NAME_SELECT",
            props: {
              disabled : false,
              className: "hr-generic-selectfield",
              optionValue: "code",
              optionLabel: "name"
            }
          }),
          beforeFieldChange: (action, state, dispatch) => {
            let store = get(
              state.screenConfiguration.preparedFinalObject,
              `searchMaster.storeNames`,
              []
            ); 
            store =  store.filter(x=> x.code === action.value) 
            if(store&& store[0])  
            {           
            let Material = get(state, "screenConfiguration.preparedFinalObject.searchScreenMdmsData.store-asset.Material",[]) 
            if(store[0].code){
              const queryObject = [{ key: "tenantId", value: getTenantId()},{ key: "store", value: store[0].code}];
              getSearchResults(queryObject, dispatch,"materials")
              .then(async response =>{
                if(response){
                  let materials = []
                  for (let index = 0; index < Material.length; index++) {
                    const element = Material[index];
                    for (let index = 0; index < response.materials.length; index++) {
                      const element_ = response.materials[index];
  // filter material which is active in material map.
                      var element_filter = element_.storeMapping.filter(function (x) {
                        return x.store.code === store[0].code && x.active === true;
                      });
                      if (element_filter.length > 0) {
                      if(element.code ===element_.code)
                      {
                        materials.push(element)
                      }
                    }
                      
                    }
                    
                  }
                  dispatch(prepareFinalObject("materials.materials", materials));
                  
                          
               }
                
              });   
  
              }
            }
           
            
        }

        },
        materialName: getSelectField({
          label: { labelName: "Material  Name", labelKey: "STORE_MATERIAL_NAME" },
          placeholder: {
            labelName: "Select Materila  Name",
            labelKey: "STORE_MATERIAL_NAME_SELECT",
          },
          required: true,
          jsonPath: "searchScreen.material",
          errorMessage: "STORE_VALIDATION_MATERIAL_NAME_SELECT",
          gridDefination: {
            xs: 12,
            sm: 4,
          },
          // sourceJsonPath: "searchScreenMdmsData.store-asset.Material",
          sourceJsonPath:"materials.materials",
          props: {
            optionValue: "code",
            optionLabel: "name",
          },
         
        }),
        asOnDate: {
          ...getDateField({
            label: {
              labelName: "From Date",
              labelKey: "STORE_CB_ASON_DATE"
            },
            placeholder: {
              labelName: "Enter From Date",
              labelKey: "STORE_CB_ASON_DATE_PLACEHOLDER"
            },
            required: true,
            visible:true,
            pattern: getPattern("Date") || null,
            jsonPath: "searchScreen.asOnDate",
            props: {
              inputProps: {
                max: getTodaysDateInYMD()
              }
            }
          })
        }
        
  }),
  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 6,
          // align: "center"
        },
        props: {
          variant: "outlined",
          style: {
            color: "#FE7A51",
            borderColor: "#FE7A51",
            //   borderRadius: "2px",
            width: "220px",
            height: "48px",
            margin: "8px",
            float: "right",
          },
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Reset",
            labelKey: "STORE_COMMON_RESET_BUTTON",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: resetFields,
        },
      },
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 6,
          // align: "center"
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            margin: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "220px",
            height: "48px",
          },
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Search",
            labelKey: "STORE_COMMON_SEARCH_BUTTON",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: ActionSubmit,
        },
      },
    }),
  }),

    }),
 
  breakAfterSearch: getBreak(),
        PensionReviewBottom: {
          uiFramework: "custom-containers-local",        
          componentPath: "InventoryContainer",
          moduleName: "egov-store-asset",
            props: {
              dataPath: "InventoryData",
              moduleName: "STORE_ASSET",
              pageName:"Stock"
            }
        },

     
       
      }
    },
    
  }
};

export default RegisterReviewResult1;
