const errors = require('restify-errors');
const yup = require('yup');
const Message = require('./models/Message');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SG_TOKEN);

module.exports = (server) => {
    server.post('/messages', (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json'")
            );
        }

        const data = req.body || {};

        const schema = yup.object().shape({
            name: yup.string().required('Please enter your name'),
            email: yup.string().email('Invalid email address').required('Please enter your email'),
            company: yup.string(),
            phone: yup.number().typeError('Should be a number'),
            message: yup.string().required('Please enter your message')
        });

        schema.validate(data)
            .then(success => {
                const message = new Message(data);
                message.save()
                    .then(data => {
                        const msg = {
                            to: 'aimar@snapit.ee',
                            from: data.email,
                            subject: 'Inquiry from snapit.ee website',
                            html: `message: ${data.message} <br /> phone: ${data.phone} <br /> sender: ${data.name} <br /> email: ${data.email}`,
                        };
                        sgMail
                            .send(msg)
                            .then(success => {
                                res.status(201);
                                res.send({ message: 'Success', data: data });
                                next();
                            })
                            .catch(error => console.error(error.toString()));
                    })
                    .catch(err => {
                        console.error('mongo error', err);
                        return next(new errors.InternalError(err));
                    });
            })
            .catch(err => {
                console.error(err.errors);
                return next(
                    new errors.UnprocessableEntityError(err)
                );
            });
    });

    server.get('/messages', (req, res, next) => {
        Message.find()
            .then(docs => {
                res.send(docs);
                next();
            })
            .catch(err => {
                console.error(err);
                return next(new errors.InternalError(err.message));
            });
    });

    server.del('/messages/:message_id', (req, res, next) => {
        Message.deleteOne({ _id: req.params.message_id })
            .then(result => {
                res.send({ message: 'deleted!' });
                next();
            })
            .catch(err => {
                console.error(err);
                return next(
                    new errors.InvalidContentError(err.errors.name.message),
                );
            });
    });
};
