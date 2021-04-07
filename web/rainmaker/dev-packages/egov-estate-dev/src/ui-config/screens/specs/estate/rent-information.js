import {
  getCommonCard, convertEpochToDate
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults ,setXLSTableData } from "../../../../ui-utils/commons";
import {onTabChange, headerrow, tabs, tabsAllotment} from './search-preview'
import { getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getReviewLicenseFee, getReviewInterest, getReviewSecurity, getReviewGroundRent, rentDetailsTable, rentDetailsTableAnnual, getReviewPremiumAmount, installmentTable, getReviewAdvanceRent } from "./applyResource/reviewProperty";
import { getTextToLocalMapping } from "../utils";
import get from "lodash/get";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { ESTATE_APPROVED_STATE,ESTATE_ALOTMENT_APPROVED_STATE } from "../../../../ui-constants";

let isPropertyMasterOrAllotmentOfSite;

export const searchResults = async (action, state, dispatch, fileNumber) => {
  let queryObject = [
    { key: "fileNumber", value: fileNumber },
    {key: "relations", value: "court"}
  ];
  const response =  await getSearchResults(queryObject)
  if(!!response) {
    let properties = response.Properties;
    dispatch(prepareFinalObject("Properties[0]", properties[0]));
  }
}

const getData = async (action, state, dispatch, fileNumber) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  if (fileNumber){
    // await searchResults(action, state, dispatch, fileNumber)
    let queryObject = [
      { key: "fileNumber", value: fileNumber },
      {key: "relations", value: "court"}
    ];
    const response =  await getSearchResults(queryObject)
    if(!!response) {
      let properties = response.Properties;
      isPropertyMasterOrAllotmentOfSite = properties[0].propertyMasterOrAllotmentOfSite;
      dispatch(prepareFinalObject("Properties[0]", properties[0]));
      // Properties[0].propertyDetails.paymentConfig.groundRentGenerationType

      return {
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
                  tabs: (isPropertyMasterOrAllotmentOfSite == "PROPERTY_MASTER") ? tabs : tabsAllotment,
                  activeIndex: (isPropertyMasterOrAllotmentOfSite == "PROPERTY_MASTER") ? 7 : 4,
                  onTabChange
                },
                type: "array",
              },
              breakAfterSearch: getBreak(),
              reviewRentInfo : getCommonCard({
                premiumAmountDetails: getReviewPremiumAmount(false, 0, "apply"),
                breakAfterSearch1: getBreak(),
                installmentTable: installmentTable,
                breakAfterSearch2: getBreak(),
                groundRentDetails: getReviewGroundRent(false, 0, "apply"),
                licenseFeeDetails: getReviewLicenseFee(false, 0, "apply"),
                breakAfterSearch2: getBreak(),
                rentTable: properties[0].propertyDetails.paymentConfig.groundRentGenerationType === "Annually" ? rentDetailsTableAnnual : rentDetailsTable,
                advanceRentDetails: getReviewAdvanceRent(false, 0, "apply"),
                interestDetails: getReviewInterest(false, 0, "apply"),
                securityDetails: getReviewSecurity(false, 0, "apply")
              })
          }
        }
      }
    }
  }

  
}

const getFormattedTill = (startMonth, endMonth, paymentConfigData) => {
  const value = (Number(endMonth) - Number(startMonth)) + 1
  const groundRentGenerationType = get(paymentConfigData, "groundRentGenerationType")
    if(groundRentGenerationType === "Annually") {
      if(value) {
        return value + " Year(s)"
      }
      return "-"
    } else if(groundRentGenerationType === "Monthly") {
      if (value) {
        const years = (Number(value) / 12 | 0)
        const months = Number(value) % 12
        if(years > 0 && months > 0) {
          return years + " Year(s) " + months +" Month(s)"
        } else if(years < 1) {
          return months + " Month(s)"
        } else if(months < 1) {
          return years + " Year(s)"
        }
      }
    }
    return "-"
}

const updateAllFields = (action, state, dispatch) => {
  const userInfo = JSON.parse(getUserInfo());
  const {roles = []} = userInfo
  const findItem = roles.find(item => item.code === "ES_EB_SECTION_OFFICER");

  const properties = get(state, "screenConfiguration.preparedFinalObject.Properties")
  let demandGenerationType = properties[0].propertyDetails.paymentConfig.isGroundRent;
  let installments = properties[0].propertyDetails.paymentConfig.premiumAmountConfigItems ? properties[0].propertyDetails.paymentConfig.premiumAmountConfigItems : []
  let rentInfo = properties[0].propertyDetails.paymentConfig.paymentConfigItems ? properties[0].propertyDetails.paymentConfig.paymentConfigItems : [];
  isPropertyMasterOrAllotmentOfSite = properties[0].propertyMasterOrAllotmentOfSite;
  let paymentConfigData = properties[0].propertyDetails.paymentConfig
  let rentData = properties[0].propertyDetails.paymentConfig.groundRentGenerationType === "Annually" ? rentInfo.map(item => ({
    [getTextToLocalMapping("Rent amount")]: item.groundRentAmount || 0,
    [getTextToLocalMapping("Start year")]: item.groundRentStartMonth || 0,
    [getTextToLocalMapping("End year")]: item.groundRentEndMonth || 0,
    [getTextToLocalMapping("Till")]: getFormattedTill(item.groundRentStartMonth, item.groundRentEndMonth, paymentConfigData)
  })) : rentInfo.map(item => ({
    [getTextToLocalMapping("Rent amount")]: item.groundRentAmount || 0,
    [getTextToLocalMapping("Start month")]: item.groundRentStartMonth || 0,
    [getTextToLocalMapping("End month")]: item.groundRentEndMonth || 0,
    [getTextToLocalMapping("Till")]: getFormattedTill(item.groundRentStartMonth, item.groundRentEndMonth, paymentConfigData)
  }))

  let installmentData = installments.map(item => ({
    [getTextToLocalMapping("Installment")]: item.premiumAmount || 0,
    [getTextToLocalMapping("Due date of installment")]: convertEpochToDate(item.premiumAmountDate) || "-",
  }))

  let isInterestFixedLabel = properties[0].propertyDetails.paymentConfig.isIntrestApplicable ? "ES_FIXED_INTEREST_LABEL" : "ES_YEARLY_INTEREST_LABEL";
  dispatch(
    handleField(
      action.screenKey,
      "components.div.children.reviewRentInfo.children.cardContent.children.advanceRentDetails",
      "visible",
      !!(isPropertyMasterOrAllotmentOfSite == "ALLOTMENT_OF_SITE")
    )
  )
  dispatch(
    handleField(
      action.screenKey,
      "components.div.children.reviewRentInfo.children.cardContent.children.premiumAmountDetails",
      "visible",
      !!(isPropertyMasterOrAllotmentOfSite == "ALLOTMENT_OF_SITE")
    )
  )
  dispatch(
    handleField(
      action.screenKey,
      "components.div.children.reviewRentInfo.children.cardContent.children.installmentTable",
      "visible",
      !!(isPropertyMasterOrAllotmentOfSite == "ALLOTMENT_OF_SITE")
    )
  )
  dispatch(
    handleField(
      action.screenKey,
      "components.div.children.reviewRentInfo.children.cardContent.children.breakAfterSearch1",
      "visible",
      !!(isPropertyMasterOrAllotmentOfSite == "ALLOTMENT_OF_SITE")
    )
  )

  dispatch(
    handleField(
      action.screenKey,
      "components.div.children.reviewRentInfo.children.cardContent.children.interestDetails.children.cardContent.children.viewInterest.children.percentageOfInterest.children.label.children.key",
      "props.labelKey",
      isInterestFixedLabel 
    )
  )
  dispatch(
    handleField(
      action.screenKey,
      "components.div.children.reviewRentInfo.children.cardContent.children.rentTable",
      "props.data",
      rentData
    )
  );
  dispatch(
    handleField(
      action.screenKey,
      "components.div.children.reviewRentInfo.children.cardContent.children.installmentTable",
      "props.data",
      installmentData
    )
  );

  dispatch(
    handleField(
      action.screenKey,
      "components.div.children.reviewRentInfo.children.cardContent.children.groundRentDetails",
      "visible",
      !!demandGenerationType
    )
  )
  dispatch(
    handleField(
      action.screenKey,
      "components.div.children.reviewRentInfo.children.cardContent.children.licenseFeeDetails",
      "visible",
      !demandGenerationType
    )
  )

  if (!!findItem && properties[0].state == (ESTATE_APPROVED_STATE || ESTATE_ALOTMENT_APPROVED_STATE)) {
    dispatch(
      handleField(
        action.screenKey,
        `components.div.children.reviewRentInfo.children.cardContent.children.rentTable.props.title`,
        `props.style.display`,
        `block`
      )
    )
  }
}


const commonRentInfo = {
  uiFramework: "material-ui",
  name: "rent-information",
  hasBeforeInitAsync: true,
  beforeInitScreen: async (action, state, dispatch) => {
      const fileNumber = getQueryArg(window.location.href, "fileNumber");
      dispatch(toggleSpinner())
      const components = await getData(action, state, dispatch, fileNumber)
      dispatch(toggleSpinner())
      setTimeout(() => updateAllFields(action, state, dispatch), 100)
      return {
        "type": "INIT_SCREEN",
        "screenKey": "rent-information",
        "screenConfig": {
          "uiFramework": "material-ui",
          "name": "rent-information",
          components
        }
      }
  }
}

export default commonRentInfo;