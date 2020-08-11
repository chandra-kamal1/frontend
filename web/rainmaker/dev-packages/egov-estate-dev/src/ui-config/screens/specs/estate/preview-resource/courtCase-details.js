import {
    getCommonCard,
    getSelectField,
    getTextField,
    getDateField,
    getCommonTitle,
    getPattern,
    getCommonContainer,
    getCommonGrayCard,
    getLabel,
    getCommonSubHeader,
    getLabelWithValue
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import {
    prepareFinalObject
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import {
    getTodaysDateInYMD
  } from "../../utils";
  import get from "lodash/get";
  
 
export const purchaserHeader = getCommonTitle({
    labelName: "Court Case Details",
    labelKey: "EST_COURT_CASE_DETAILS_HEADER"
  }, {
    style: {
      marginBottom: 18,
      marginTop: 18
    }
  })
  
  const estateOfficerCourtField = {
   
        labelName: "Estate Officer Court",
        labelKey: "EST_ESTATE_OFFICER_COURT_LABEL"
  }
  
  const commissionersCourtField = {
  
        labelName: "Commissioners Court",
        labelKey: "EST_COMMISSIONERS_COURT_LABEL",
  }
  
  const chiefAdministratorsCourtField = {
    
        labelName: "Chief Administrators Court",
        labelKey: "EST_CHIEF_ADMINISTRATORS_COURT_LABEL",

  }
  
  const advisorToAdminCourtField = {
    
        labelName: "Advisor to Admin Court",
        labelKey: "EST_ADVISOR_TO_ADMIN_COURT_LABEL",
   
  }
  
  const honbleDistrictCourtField = {
   
        labelName: "Hon'ble District Court",
        labelKey: "EST_HONBLE_DISTRICT_COURT_LABEL",
   
  }
  
  const honbleHighCourtField = {
   
        labelName: "Hon'ble High Court",
        labelKey: "EST_HONBLE_HIGH_COURT_LABEL",
    
  }
  
  const honbleSupremeCourtField = {
    
        labelName: "Hon'ble Supreme Court",
        labelKey: "EST_HONBLE_SUPREME_COURT_LABEL",
    
  }

  export const editSection = {
    componentPath: "Button",
    props: {
        color: "primary"
    },
    gridDefination: {
        xs: 12,
        sm: 2,
        align: "right"
    },
    children: {
        editIcon: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            props: {
                iconName: "edit"
            }
        },
        buttonLabel: getLabel({
            labelName: "Edit",
            labelKey: "TL_SUMMARY_EDIT"
        })
    }
}

  const masterEntryEditSection = (isEditable) => ({
    ...editSection,
    visible: isEditable,
    onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
            changeStep(state, dispatch, "apply", "", 0);
        }
    }
})
export const headerDiv = {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
        style: { marginBottom: "10px" }
    }
}

   export const getCourtCaseDetails = (isEditable = true) => {
    return getCommonGrayCard({
      headerDiv: {
        ...headerDiv,
        children: {
          header: {
            gridDefination: {
              xs: 12,
              sm: 10
            },
            ...getCommonSubHeader({
              labelName: "Court Case Details",
              labelKey: "EST_COURT_CASE_DETAILS_HEADER"
            })
          },
          editSection: masterEntryEditSection(isEditable, 0)
        }
      },
      viewFour: getCommonContainer({
          estateOfficerCourt: getLabelWithValue(
             estateOfficerCourtField, {
              jsonPath: "Properties[0].propertyDetails.courtCases[0].estateOfficerCourt"
            }
          ),
          commissionersCourt: getLabelWithValue(
            commissionersCourtField, {
              jsonPath: "Properties[0].propertyDetails.courtCases[0].commissionersCourt"
            }
          ),
          chiefAdministratorsCourt:getLabelWithValue(
            chiefAdministratorsCourtField, {
              jsonPath: "Properties[0].propertyDetails.courtCases[0].chiefAdministratorsCourt"
            }
          ),
          advisorToAdminCourt: getLabelWithValue(
            advisorToAdminCourtField, {
              jsonPath: "Properties[0].propertyDetails.courtCases[0].advisorToAdminCourt"
            }
          ),
          honbleDistrictCourt: getLabelWithValue(
            honbleDistrictCourtField, {
              jsonPath: "Properties[0].propertyDetails.courtCases[0].honorableDistrictCourt"
            }
          ),
          honbleHighCourt: getLabelWithValue(
            honbleHighCourtField, {
              jsonPath: "Properties[0].propertyDetails.courtCases[0].honorableHighCourt"
            }
          ),
          honbleSupremeCourt: getLabelWithValue(
            honbleSupremeCourtField, {
              jsonPath: "Properties[0].propertyDetails.courtCases[0].honorableSupremeCourt"
            }
          )
      })
    })
  }


