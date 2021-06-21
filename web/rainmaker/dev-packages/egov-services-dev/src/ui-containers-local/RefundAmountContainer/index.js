import React, { Component } from "react";
import { FeesEstimateCard } from "../../ui-molecules-local";
import { connect } from "react-redux";
import get from "lodash/get";
import { calculateCancelledBookingRefundAmount } from "../../ui-config/screens/specs/utils";

class RefundAmountContainer extends Component {

    render() {
        const { refundAmount } = this.props;

        return (
            <div style={{ marginLeft: "23px" }}>
                Refund Amount - <span style={{ fontWeight: "bold" }}>Rs. {refundAmount}</span>
            </div>
        )
    }
}



const mapStateToProps = (state, ownProps) => {
    const { screenConfiguration } = state;

    const applicationNumber = get(
        screenConfiguration,
        "preparedFinalObject.Booking.applicationNumber",
        []
    )

    const bookingDate = get(
        screenConfiguration,
        "preparedFinalObject.Booking.bkFromDate",
        []
    )
    //     let refundAmount = 0;
    //     refundAmount = await calculateCancelledBookingRefundAmount(applicationNumber, "ch.chandigarh", bookingDate);
    //   console.log(refundAmount, "nero refundAmount");

    var billAccountDetails = get(
        screenConfiguration,
        "preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails[0].billAccountDetails",
        []
    );
    let bookingAmount = 0;
    let securityAmount = 0;
    for (let i = 0; i < billAccountDetails.length; i++) {
        if (billAccountDetails[i].taxHeadCode == "SECURITY_MANUAL_OPEN_SPACE_BOOKING_BRANCH" || billAccountDetails[i].taxHeadCode == "SECURITY_CHRGS_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH") {
            // bookingAmount += billAccountDetails[i].amount;
            securityAmount += billAccountDetails[i].amount;
        }
        if (billAccountDetails[i].taxHeadCode == "PARKING_LOTS_MANUAL_OPEN_SPACE_BOOKING_BRANCH" || billAccountDetails[i].taxHeadCode == "RENT_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH") {
            bookingAmount += billAccountDetails[i].amount;
        }
    }
    const txnTotalAmount = get(
        screenConfiguration,
        "preparedFinalObject.ReceiptTemp[0].Bill[0].totalAmount",
        []
    )
    /************************/
    //Cancelled Rooms booking refund
    const bookedRoomsPaymentDetails = get(
        screenConfiguration,
        "preparedFinalObject.bookedRoomsPaymentDetails",
        []
    )
    let roomBookingAmount = 0;
    if (bookedRoomsPaymentDetails && bookedRoomsPaymentDetails.length > 0) {
        for (let j = 0; j < bookedRoomsPaymentDetails[0].length; j++) {
            for (let k = 0; k < bookedRoomsPaymentDetails[0][j].paymentDetails[0].bill.billDetails[0].billAccountDetails.length; k++) {
                if (bookedRoomsPaymentDetails[0][j].paymentDetails[0].bill.billDetails[0].billAccountDetails[k].taxHeadCode === "RENT_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH") {
                    roomBookingAmount += bookedRoomsPaymentDetails[0][j].paymentDetails[0].bill.billDetails[0].billAccountDetails[k].amount;
                }
            }
        }
    }
    /*************************/
    // Adding Cancelled CC center refund money and existed cancelled rooms before implementing Business rule of deduction
    if (roomBookingAmount > 0) {
        bookingAmount += roomBookingAmount;
    }



    var date1 = new Date(bookingDate);
    var date2 = new Date();

    var Difference_In_Time = date1.getTime() - date2.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    let refundAmount = 0
    if (Difference_In_Days > 29) {
        const refundPercent = get(
            screenConfiguration,
            "preparedFinalObject.cancelParkCcScreenMdmsData.Booking.bookingCancellationRefundCalc[0].MORETHAN30DAYS.refundpercentage",
            []
        )

        refundAmount = (parseFloat(bookingAmount) * refundPercent) / 100
    } else if (Difference_In_Days > 15 && Difference_In_Days < 30) {
        const refundPercent = get(
            screenConfiguration,
            "preparedFinalObject.cancelParkCcScreenMdmsData.Booking.bookingCancellationRefundCalc[0].LETTHAN30MORETHAN15DAYS.refundpercentage",
            []
        )
        refundAmount = (parseFloat(bookingAmount) * refundPercent) / 100
    }

    if (securityAmount > 0) {
        refundAmount = refundAmount + securityAmount;
    }


    return { refundAmount };
};

export default connect(mapStateToProps, null)(RefundAmountContainer);
