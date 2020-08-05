import {
  getCommonCard,
  getCommonContainer,
  getCommonParagraph,
  getCommonTitle,
  getLabel,
  getPattern,
  getSelectField,
  getDateField,
  getTextField,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { searchApiCall } from "./functions";

const resetFields = (state, dispatch) => {
  const textFields = ["indentNumber", "receiptType","issueStorefrom","issueStoreto"];
  for (let i = 0; i < textFields.length; i++) {
    if (
      `state.screenConfiguration.screenConfig.search-material-transfer-inword.searchForm.children.cardContent.children.searchFormContainer.children.${textFields[i]}.props.value`
    ) {
      dispatch(
        handleField(
          "search-material-transfer-inword",
          `components.div.children.searchForm.children.cardContent.children.searchFormContainer.children.${textFields[i]}`,
          "props.value",
          ""
        )
      );
    }
  }
  dispatch(prepareFinalObject("searchScreen", {}));
};
export const searchForm = getCommonCard({
  subHeader: getCommonTitle({
    labelName: "Search Criteria",
    labelKey: "STORE_SEARCH_RESULTS_HEADING",
  }),
  subParagraph: getCommonParagraph({
    labelName: "Provide at least one parameter to search for an application",
    labelKey: "STORE_HOME_SEARCH_RESULTS_DESC",
  }),
  searchFormContainer: getCommonContainer({
    mrnNumber: getTextField({
      label: { labelName: "Material Receipt Number", labelKey: "STORE_MATERIAL_COMMON_MRN_NUMBER" },
      placeholder: {
        labelName: "Material Receipt Number",
        labelKey: "STORE_MATERIAL_COMMON_MRN_NUMBER",
      },
      required: false,
      jsonPath: "searchScreen.mrnNumber",
      gridDefination: {
        xs: 12,
        sm: 4,
      },
     
    }),
    receiptType: {
      ...getSelectField({
        label: { labelName: "Receipt Type", labelKey: "STORE_MATERIAL_RECEIPT_RECEIPT_TYPE" },
        placeholder: {
          labelName: "Select Receipt Type",
          labelKey: "STORE_MATERIAL_RECEIPT_RECEIPT_TYPE_SELECT"
        },
        required: false,
        jsonPath: "searchScreen.receiptType",
        gridDefination: {
          xs: 12,
          sm: 4,
        },
        //sourceJsonPath: "createScreenMdmsData.store-asset.RateType",
      props: {
        data: [
          {
            code: "PurchaseReceipt",
            name: "Purchase Receipt"
          },
         
        ],
        optionValue: "code",
        optionLabel: "name",
      },
      })
    },
    issueStorefrom: {
      ...getSelectField({
        label: {
          labelName: " Store Name",
          labelKey: "STORE_DETAILS_STORE_NAME"
        },
        placeholder: {
          labelName: "Select  Store Name",
          labelKey: "STORE_DETAILS_STORE_NAME_SELECT"
        },
        required: false,
        jsonPath: "searchScreen.issueStorefrom",
        gridDefination: {
          xs: 12,
          sm: 4,
        },
        sourceJsonPath: "store.stores",
      props: {        
        optionValue: "code",
        optionLabel: "name",
      },
      })
    },
    issueStoreto: {
      ...getSelectField({
        label: {
          labelName: "Supplier Name",
          labelKey: "STORE_COMMON_TABLE_COL_SUPPLIER_MASTER_NAME"
        },
        placeholder: {
          labelName: "Select  Supplier Name",
          labelKey: "STORE_COMMON_TABLE_COL_SUPPLIER_MASTER_NAME"
        },
        required: false,
        jsonPath: "searchScreen.supplierCode",
        gridDefination: {
          xs: 12,
          sm: 4,
        },
        sourceJsonPath: "store.stores",
      props: {
        
        optionValue: "code",
        optionLabel: "name",
      },
      })
    },
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
          callBack: searchApiCall,
        },
      },
    }),
  }),
});
