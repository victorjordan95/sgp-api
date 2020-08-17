import Payment from '../models/Payment';

class PaymentController {
  async store(req, res) {
    const payment = await Payment.findOne({
      where: {
        appointment_id: req.body.appointment_id,
      },
    });
    if (payment) {
      payment.update(req.body);
    } else {
      payment.create(req.body);
    }
    return res.json(payment);
  }
}

export default new PaymentController();
