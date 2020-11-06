import {
  getCommonCard,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getSearchResults,
  populateBiddersTable
} from "../../../../ui-utils/commons";
import {
  getReviewAuction
} from "./preview-resource/preview-properties";
import {
  getUserInfo,
  getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import {
  onTabChange,
  headerrow,
  tabs
} from './search-preview';
import {
  auctionTable
} from './applyResource/auction-details';
import {
  getTextToLocalMapping
} from '../utils'

const searchResults = async (action, state, dispatch, fileNumber) => {
  let queryObject = [
    { key: "fileNumber", value: fileNumber },
    {key: "relations", value: "bidder"}
  ];
  let payload = await getSearchResults(queryObject);
  if (payload) {
    let properties = payload.Properties;
    dispatch(prepareFinalObject("Properties", properties));
    if (properties[0].propertyDetails.bidders) {
      dispatch(
        handleField(
          "auction-details",
          "components.div.children.auctionTableContainer",
          "visible",
          true
        )
      );
      let { bidders } = properties[0].propertyDetails;
      populateBiddersTable(bidders, "auction-details", "components.div.children.auctionTableContainer")
    }
  }
}

const beforeInitFn = async (action, state, dispatch, fileNumber) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  if(fileNumber){
      await searchResults(action, state, dispatch, fileNumber);
  }
}

let auctionDetailsCont = getReviewAuction(false);
const auctionDetailsContainer = getCommonCard({
  auctionDetailsCont
})

const auctionTableContainer = auctionTable;

const auctionDetails = {
  uiFramework: "material-ui",
  name: "auction-details",
  beforeInitScreen: (action, state, dispatch) => {
    let fileNumber = getQueryArg(window.location.href, "fileNumber");
    beforeInitFn(action, state, dispatch, fileNumber);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css search-preview"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header1: {
              gridDefination: {
                xs: 12,
                sm: 8
              },
              ...headerrow
            },
          }
        },
        tabSection: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-estate",
          componentPath: "CustomTabContainer",
          props: {
            tabs,
            activeIndex: 1,
            onTabChange
          },
          type: "array",
        },
        auctionDetailsContainer,
        breakAfterSearch: getBreak(),
        auctionTableContainer
      }
    }
  }
};

export default auctionDetails;