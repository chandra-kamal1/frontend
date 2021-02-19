import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import "./index.css";
import EditIcon from '@material-ui/icons/Edit';

class PayDetails extends Component {
   
render() {
    return (
      <div>
        <Card
          textChildren={
            <div>  
                <Label label="BK_MYBK_FEE_ESTIMATE" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
                   
              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px',marginTop:30}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BKROOM_TAX" />
                </div>
                <div className="col-sm-4 col-xs-12"> 
                <h5 style={{ textAlign: "right" }}>{this.props.BKROOM_TAX}</h5>
                </div>
              </div>

              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BKROOM" />
                </div>
                <div className="col-sm-4 col-xs-12">
                <h5 style={{ textAlign: "right" }}>{this.props.BKROOM}</h5>
                </div>
              </div>
             

              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BKROOM_ROUND_OFF" />
                </div>
                <div className="col-sm-4 col-xs-12">
                <h5 style={{ textAlign: "right" }}>{this.props.BKROOM_ROUND_OFF}</h5>
              
                </div>
              </div>
              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_EMP_ROOM_FACILITATION_CHARGE" /> {/*BK_MYBK_TAX_RENT_PACC*/}
                </div>
                <div className="col-sm-4 col-xs-12">
                  <h5 style={{ textAlign: "right" }}>{this.props.four}</h5>
                </div>
              </div>

              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <hr class="MuiDividerLine" style={{ marginbottom: "16px" }}></hr>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_TOTAL_AMOUNT" />
                </div>
                <div className="col-sm-4 col-xs-12">
                  <h5 style={{ textAlign: "right" }}>{this.props.totalAmountPaid}</h5>
                </div>
              </div>


            </div>
             } 
          /> 
      </div>
    );
  }
}

export default PayDetails;