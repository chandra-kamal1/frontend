import React, { Component } from 'react'
import get from "lodash/get";
import { connect } from "react-redux";
import set from "lodash/set";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
    prepareFinalObject,
   
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
 class index extends Component {

    componentDidMount(){
        const changeDateVenue = getQueryArg(
            window.location.href,
            "changeDateVenue"
        );
       
        if(changeDateVenue!= null ||changeDateVenue!= undefined){
            set(
                this.props.state.screenConfiguration.screenConfig["applyparkcommunitycenter"],
                "components.div.children.formwizardFirstStep.children.personalDetails.visible", 
                false
                );
            set(
                this.props.state.screenConfiguration.screenConfig["applyparkcommunitycenter"],
                "components.div.children.formwizardSecondStep.children.bookingDetails.visible", 
                false
                );
            set(
                this.props.state.screenConfiguration.screenConfig["applyparkcommunitycenter"],
                "components.div.children.formwizardThirdStep.children.bankAccountDetails.visible", 
                false
                );    
        }else{
      
            set(
                this.props.state.screenConfiguration.screenConfig["applyparkcommunitycenter"],
                "components.div.children.formwizardFirstStep.children.personalDetailsDisabled.visible", 
                false
            );
            set(
                this.props.state.screenConfiguration.screenConfig["applyparkcommunitycenter"],
                "components.div.children.formwizardSecondStep.children.bookingDetailsDisabled.visible", 
                false
            );
            set(
                this.props.state.screenConfiguration.screenConfig["applyparkcommunitycenter"],
                "components.div.children.formwizardThirdStep.children.bankAccountDetailsDisabled.visible", 
                false
            );
        }
        this.setState({test: 2})
	    this.props.prepareFinalObject("changeDateVenue",'Enabled')
	}   

    state={
        test : 1
    }
    
    render() {
        return (
            <div>
                
            </div>
        )
    }
}
const mapStateToProps = state => {
    const { screenConfiguration } = state;
    const { screenConfig, preparedFinalObject } = screenConfiguration;
    return { screenConfig, preparedFinalObject, state ,screenConfiguration};
  };

const mapDispatchToProps = dispatch => {
    return {
        prepareFinalObject: (path, value) =>
        dispatch(prepareFinalObject(path, value)),
      }
    
  };

export default connect(mapStateToProps, mapDispatchToProps)(index)

