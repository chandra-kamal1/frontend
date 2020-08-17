import {
    getCommonHeader,
    getCommonContainer,
    getCommonCard,
    getCommonGrayCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg, setDocuments } from "egov-ui-framework/ui-utils/commons";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { set } from "lodash";
import { getreviewPropertyAddressDetailsMortgage, getReviewApplicantDetailsMortgage,getreviewGrantDetailsMortgage } from "./applyResource/review-applications-mortgage";
import { getMortgageSearchResults } from "../../../../ui-utils/commons";
import { getReviewDocuments } from "./applyResource/review-documents";
import {  downloadPrintContainer,footerReviewTop } from "./applyResource/reviewFooter";

let applicationNumber = getQueryArg(window.location.href, "applicationNumber");

const headerrow = getCommonContainer({
  header: getCommonHeader({
    labelName: "Mortgage Application",
    labelKey: "MORTGAGE_APPLICATION_HEADER"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-rented-properties",
    componentPath: "ApplicationNoContainer",
    props: {
      number: applicationNumber
    }
  }
});

const reviewPropertyAddressDetailsMortgage = getreviewPropertyAddressDetailsMortgage(false);
const reviewApplicantDetailsMortgage = getReviewApplicantDetailsMortgage(false);
const reviewDocuments = getReviewDocuments(false, "mortage-apply", "MortgageApplicationsTemp[0].reviewDocData")
const reviewGrantDetailsMortgage=getreviewGrantDetailsMortgage(false)
const mortgageReviewDetails = getCommonCard({
    reviewPropertyAddressDetailsMortgage,
    reviewApplicantDetailsMortgage,
    reviewDocuments,
    reviewGrantDetailsMortgage
})

const beforeInitFn = async(action, state, dispatch) => {
    dispatch(prepareFinalObject("workflow.ProcessInstances", []))
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    const tenantId = getQueryArg(window.location.href, "tenantId")
    if(!!applicationNumber) {
      const queryObject = [
        {key: "applicationNumber", value: applicationNumber}
      ]
      const response = await getMortgageSearchResults(queryObject);
      if (response && response.MortgageApplications) {
      let {MortgageApplications} = response
      const grandDetails=MortgageApplications[0].mortgageApprovedGrantDetails
      let applicationDocuments = MortgageApplications[0].applicationDocuments|| [];
      const removedDocs = applicationDocuments.filter(item => !item.active)
      applicationDocuments = applicationDocuments.filter(item => !!item.active)
      MortgageApplications = [{...MortgageApplications[0], applicationDocuments}]
      dispatch(prepareFinalObject("MortgageApplications", MortgageApplications))
      dispatch(
        prepareFinalObject(
          "MortgageApplicationsTemp[0].removedDocs",
          removedDocs
        )
      );
      await setDocuments(
        response,
        "MortgageApplications[0].applicationDocuments",
        "MortgageApplicationsTemp[0].reviewDocData",
        dispatch,'RP'
      );
      const getGrantDetailsAvailed = grandDetails !==null
      dispatch(
        handleField(
          "mortgage-search-preview",
          "components.div.children.mortgageReviewDetails.children.cardContent.children.reviewGrantDetailsMortgage",
          "visible",
          getGrantDetailsAvailed
      ),
    );
      }
    }
    const printCont = downloadPrintContainer(
      action,
      state,
      dispatch,
      status,
      applicationNumber,
      tenantId
    );
    const CitizenprintCont=footerReviewTop(
      action,
      state,
      dispatch,
      status,
      applicationNumber,
      tenantId,
      //financialYear
    );


    process.env.REACT_APP_NAME === "Citizen"
      ? set(
          action,
          "screenConfig.components.div.children.headerDiv.children.helpSection.children",
          CitizenprintCont
        )
      : set(
          action,
          "screenConfig.components.div.children.headerDiv.children.helpSection.children",
          printCont
        );
  }
const mortgagePreviewDetails = {
    uiFramework: "material-ui",
    name: "mortgage-search-preview",
    beforeInitScreen: (action, state, dispatch) => {
        beforeInitFn(action, state, dispatch)
        return action
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
                  helpSection: {
                    uiFramework: "custom-atoms",
                    componentPath: "Container",
                    props: {
                      color: "primary",
                      style: { justifyContent: "flex-end" }
                    },
                    gridDefination: {
                      xs: 12,
                      sm: 4,
                      align: "right"
                    }
                  }
                  }
                },
                taskStatus: {
                  uiFramework: "custom-containers-local",
                  moduleName: "egov-rented-properties",
                  componentPath: "WorkFlowContainer",
                  props: {
                    dataPath: "MortgageApplications",
                    moduleName: "PermissionToMortgage",
                    updateUrl: "/csp/mortgage/_update"
                  }
                },
                mortgageReviewDetails
            }
          }
    }
}

export default mortgagePreviewDetails