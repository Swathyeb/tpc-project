import React from "react";

const sectionStyle = {
  flexBasis: '25%',
  backgroundColor: 'rgb(234, 245, 252)',
  borderRadius: '10px',
  marginBottom: '3%',
  padding: '15px 10px',
  boxSizing: 'border-box'
};
function Contact() {
  return (
    <div className="p-6">
      
      <section id="staff" style={sectionStyle}>
                    <div className="row">
                        <div className="about-col">
                            <h3 className="text-2xl font-bold">Staff details</h3>
                            <ul>
                                <li>Divya - Head of TPC</li>
                                <li>Jane - Placement Coordinator</li>
                                <li>Joy - Career Counselor</li>
                            </ul>
                        </div>
                    </div>
                </section>

                
                <section id="contact" style={sectionStyle}>
                    <div className="row">
                        <div className="about-col">
                            <h3 className="text-2xl font-bold">Contact</h3>
                            <p className="mt-4 text-lg">Email: tpc@college.edu</p>
                            <p className="mt-4 text-lg">Phone: +123 456 7890</p>
                        </div>
                    </div>
                </section>
    </div>
  );
}

export default Contact;
