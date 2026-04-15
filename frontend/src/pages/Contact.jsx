import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaFacebookF,
} from "react-icons/fa";

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_arcf9p5",
        "template_pv6f52r",
        form.current,
        "dG72Zj-fttyiSe1-p"
      )
      .then(
        () => {
          alert("✅ Message sent successfully!");
          form.current.reset();
        },
        (error) => {
          alert("❌ Failed to send message");
          console.log(error);
        }
      );
  };

  return (
    <div className="px-6 md:px-12 lg:px-20 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
          Contact <span className="text-blue-600">VitaMed Clinic</span>
        </h1>
        <p className="text-gray-500 mt-4">
          We’re here to help you anytime — reach out easily.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">

        {/* LEFT */}
        <div className="space-y-6">

          {/* PHONE */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <a
              href="tel:01010083448"
              className="flex items-center gap-4 hover:text-blue-600 transition"
            >
              <FaPhoneAlt className="text-blue-600" />
              <p>01010083448</p>
            </a>
          </div>

          {/* EMAIL */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <a
              href="mailto:vitamedclinic085@gmail.com"
              className="flex items-center gap-4 hover:text-blue-600 transition"
            >
              <FaEnvelope className="text-blue-600" />
              <p>vitamedclinic085@gmail.com</p>
            </a>
          </div>

          {/* WHATSAPP */}
          <a
            href="https://wa.me/201010083448?text=Hello%20VitaMed%20Clinic"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-3 
            bg-green-500 text-white py-3 rounded-full"
          >
            <FaWhatsapp />
            WhatsApp
          </a>

          {/* SOCIAL */}
          <div className="flex gap-4 text-gray-600">

            <a
              href="https://www.facebook.com/share/1HzjA3aUA2/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition"
            >
              <FaFacebookF size={18} />
            </a>

          </div>

        </div>

        {/* RIGHT FORM */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">
            Send a Message
          </h2>

          <form ref={form} onSubmit={sendEmail} className="space-y-4">

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="w-full border px-4 py-3 rounded-lg"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="w-full border px-4 py-3 rounded-lg"
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              className="w-full border px-4 py-3 rounded-lg"
              required
            />

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg"
            >
              Send Message
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;