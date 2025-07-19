import React from "react";

const sectionStyle = {
  flexBasis: '25%',
  backgroundColor: 'rgb(234, 245, 252)',
  borderRadius: '10px',
  marginBottom: '3%',
  padding: '15px 10px',
  boxSizing: 'border-box'
};

function About() {
  return (
    <div className="p-6">
       <div>
                <br />
                <h1 className="text-4xl font-bold text-center">Training And Placement Cell</h1>

                <br />
                <br />
                <section id="about" style={sectionStyle}>
                    <br />
                    <div className="p-6">
                        <h3 className="text-2xl font-bold">About Us</h3>
                        <p className="mt-4 text-lg">
                            The Training and Placement Cell aims to provide the best career opportunities to students.
                        </p>
                    </div>
                </section>
                </div>
    </div>
  );
}

export default About;
