import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import { connect } from "react-redux";
import "./index.css";

class CGBookingDetails extends Component {

  render() {
return (
      <div>
        <Card
          textChildren={
            <div>
              <div className="rainmaker-displayInline">
                
                <Label label="BK_MYBK_COMMUNITY_CENTER_DETAILS" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
              </div>
              <div key={10} className="complaint-detail-full-width">
              
              <div className="complaint-detail-detail-section-status row">
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_COMMON_APPLICATION_NO" />
                    <Label
                      labelStyle={{ color: "inherit" }}
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      id="complaint-details-complaint-number"
                      label={applicationNo}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICATION_BOOKING_TYPE" />
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      // label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={bookingType}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_PCC_PURPOSE_LABEL" />
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      // label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={bkBookingPurpose}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICANT_SECTOR_FOR_PARK" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"
                    
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={sector}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICATION_DETAILS_CURRENT_STATUS" />
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      id="complaint-details-current-status"
                      labelStyle={{ color: "inherit" }}
                      label={status}
                    />
                  </div>


                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICATION_DETAILS_SUBMISSION_DATE" />
                    <b><Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      // label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={dateCreated}
                    /></b>
                  </div> 

                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_PCC_FROM_DATE_LABEL" />
                    <b><Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      // label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={bkFromDate}
                    /></b>
                  </div>

                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_PCC_TO_DATE_LABEL" />
                    <b><Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      // label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={bkToDate}
                    /></b>
                  </div>
                 
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_PCC_LOCATION_LABEL" />  {/*BK_MYBK_PARK_LOCATIION_BOOKING*/}
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      // label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={bkLocation}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_PCC_DIMENSION_LABEL" /> {/*BK_MYBK_PARK_DIMENTION_AREA*/}
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      // label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={bkDimension + "Sq.Yards"}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_PCC_SURCHARGE_RENT_LABEL" /> {/*BK_MYBK_PARK_DIMENTION_AREA*/}
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      // label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={bkSurchargeRent}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_PCC_RENT_LABEL" /> {/*BK_MYBK_PARK_DIMENTION_AREA*/}
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      // label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={bkRent}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_PCC_UTGST_LABEL" /> {/*BK_MYBK_PARK_DIMENTION_AREA*/}
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      // label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={bkUtgst}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_PCC_CGST_LABEL" /> {/*BK_MYBK_PARK_DIMENTION_AREA*/}
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      // label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={bkCgst}
                    />
                  </div>
                 
                </div>
              </div>
          </div>
        }
      />
    </div>
  );
}
}


const mapStateToProps = state => {

    const { complaints, common, auth, form,bookings } = state;
  
    return {
      state
    }

}
const mapDispatchToProps = dispatch => {
    return {
        toggleSnackbarAndSetText: (open, message, error) =>
            dispatch(toggleSnackbarAndSetText(open, message, error)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CGBookingDetails);

