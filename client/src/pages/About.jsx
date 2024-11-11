/* eslint-disable react/no-unescaped-entities */
import React from 'react';

const About = () => {
  return (
    <div className="py-16 px-4 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-blue-800 text-center">About Property Hub</h1>

        {/* Logo or relevant image */}
        {/* <div className="mb-8">
          <img 
            src="path/to/logo_or_image.jpg" 
            alt="Property Hub Logo" 
            className="mx-auto h-24 w-auto" 
          />
        </div> */}

        <section className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
          <p className="mb-4 text-gray-700">
            Property Hub is a leading real estate agency specializing in helping clients buy, sell, and rent properties in the most desirable neighborhoods. Our experienced agents are dedicated to providing exceptional service, making the buying and selling process as smooth as possible.
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="mb-4 text-gray-700">
            Our mission is to help clients achieve their real estate goals by providing expert advice, personalized service, and a deep understanding of the local market. Whether you're looking to buy, sell, or rent a property, we're here to guide you every step of the way.
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
          <p className="mb-4 text-gray-700">
            With a team of agents boasting a wealth of experience and knowledge in the real estate industry, we are committed to delivering the highest level of service to our clients. We believe that buying or selling a property should be an exciting and rewarding experience, and we're dedicated to making that a reality for each and every one of our clients.
          </p>
        </section>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <h3 className="text-xl font-semibold mb-2">Ready to Start Your Journey?</h3>
          <p className="mb-4 text-gray-700">Contact us today to discuss your real estate needs!</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200">
            Get in Touch
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
