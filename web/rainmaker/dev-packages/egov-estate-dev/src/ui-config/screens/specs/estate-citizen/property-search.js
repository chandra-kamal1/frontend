import {
  getCommonHeader,
  getLabel,
  getBreak,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { estateApplication, resetFields } from './citizenSearchResource/estateApplication';
import { searchResults } from './citizenSearchResource/searchResults';
import commonConfig from "config/common.js";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../ui-utils";
import {
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { ESTATE_SERVICES_MDMS_MODULE } from "../../../../ui-constants";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";


const header = getCommonHeader({
  labelName: "Search Property",
  labelKey: "ES_SEARCH_PROPERTY_HEADER"
});
const  updateAllFields=async(action, state, dispatch)=>{
  const branchType = getQueryArg(window.location.href, "branchType") || "ESTATE_BRANCH";
  if(branchType==="BUILDING_BRANCH")
  {
  dispatch(handleField(
    "property-search",
    "components.div.children.estateApplication.children.cardContent.children.searchBoxContainer.children.searchBy",
    "props.buttons[1].labelKey" ,
    "ES_BB_HOUSE_NUMBER_LABEL"
  ))
  }
}
const getMdmsData = async (dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [{
        moduleName: ESTATE_SERVICES_MDMS_MODULE,
        masterDetails: [
          {
            name: "categories"
          },
          {
            name: "sector"
          }
      ]
      }]
    }
  };
  try {
    let payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    return dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
}

const citizenEstateSearchAndResult = {
  uiFramework: "material-ui",
  name: "property-search",
  beforeInitScreen: (action, state, dispatch) => {
    const userInfo = JSON.parse(getUserInfo());
    const {roles = []} = userInfo
    // block refund tile access in Manimajra as there is no refund page there
    const manimajraRefundPageAccess = roles.find(item => /^ES_EB/.test(item.code));
    const params = new URLSearchParams(window.location.search)
    const paramTypeValue = params.get('type')
    if(manimajraRefundPageAccess === undefined && userInfo.type != "CITIZEN" && paramTypeValue === "refund"){
      dispatch(
        setRoute(
         `/estate/home`
        )
      )
    }
    state.screenConfiguration.preparedFinalObject.citizenSearchScreen = {}
    resetFields(state, dispatch);
    getMdmsData(dispatch);
    setTimeout(() => updateAllFields(action, state, dispatch), 100)
    return action
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "search"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 8
              },
              ...header
            },
            addButton: {
              componentPath: "Button",
              visible: getQueryArg(window.location.href, "branchType") === "BUILDING_BRANCH",
              gridDefination: {
                xs: 12,
                sm: 4,
                align: "right"
              },
              props: {
                variant: "contained",
                style: {
                  color: "white",
                  backgroundColor: "#fe7a51",
                  borderColor: "#fe7a51",
                  borderRadius: "2px",
                  width: "50%",
                  height: "48px",
                }
              },
              children: {
                buttonLabel: getLabel({
                  labelName: "Add Property Master",
                  labelKey: "ES_ESTATE_HOME_ADD_BUTTON"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                  window.location.href = `_apply?applicationType=${getQueryArg(window.location.href, "type")}`;
                  }
                }
              }
            }
          },
        estateApplication,
        breakAfterSearch: getBreak(),
        searchResults
      },
      }
    }
};

export default citizenEstateSearchAndResult;