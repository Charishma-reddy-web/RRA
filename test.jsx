import React, { useState } from 'react';
import { ChevronRight, Mail, Users, Search, Upload, Check, X } from 'lucide-react';

const ReferralWireframes = () => {
  const [activeView, setActiveView] = useState('navigation');

  const screens = [
    { id: 'navigation', name: 'Navigation Overview' },
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'jobs', name: 'Browse Jobs' },
    { id: 'form', name: 'Referral Form' },
    { id: 'email', name: 'Email Template' },
    { id: 'confirmation', name: 'Confirmation' },
    { id: 'tracking', name: 'Track Referrals' }
  ];

  const NavigationView = () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Employee Referral System - User Flow</h2>
      <div className="space-y-4">
        <div className="border-2 border-gray-800 p-6 bg-white">
          <h3 className="font-bold mb-4">Primary User Flows:</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">1</div>
              <div className="flex-1 border border-gray-400 p-3">Dashboard</div>
              <ChevronRight size={20} />
              <div className="flex-1 border border-gray-400 p-3">Browse Jobs</div>
              <ChevronRight size={20} />
              <div className="flex-1 border border-gray-400 p-3">Submit Referral</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">2</div>
              <div className="flex-1 border border-gray-400 p-3">Email Integration</div>
              <ChevronRight size={20} />
              <div className="flex-1 border border-gray-400 p-3">Auto-populate Form</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm">3</div>
              <div className="flex-1 border border-gray-400 p-3">Track Status</div>
              <ChevronRight size={20} />
              <div className="flex-1 border border-gray-400 p-3">Get Rewards</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="p-6">
      <div className="border-2 border-gray-800 bg-white">
        {/* Header */}
        <div className="border-b-2 border-gray-800 p-4 flex justify-between items-center">
          <div className="text-xl font-bold">EMPLOYEE REFERRAL PORTAL</div>
          <div className="flex gap-4">
            <div className="border border-gray-400 px-3 py-1">Profile</div>
            <div className="border border-gray-400 px-3 py-1">Notifications (3)</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="border-2 border-gray-400 p-4">
              <div className="text-sm text-gray-600">Active Referrals</div>
              <div className="text-3xl font-bold">5</div>
            </div>
            <div className="border-2 border-gray-400 p-4">
              <div className="text-sm text-gray-600">Successful Hires</div>
              <div className="text-3xl font-bold">2</div>
            </div>
            <div className="border-2 border-gray-400 p-4">
              <div className="text-sm text-gray-600">Rewards Earned</div>
              <div className="text-3xl font-bold">$2,000</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 bg-blue-600 text-white p-4 font-bold border-2 border-gray-800 hover:bg-blue-700">
              + NEW REFERRAL
            </button>
            <button className="flex-1 border-2 border-gray-800 p-4 font-bold hover:bg-gray-100">
              BROWSE OPEN POSITIONS
            </button>
          </div>

          {/* Recent Referrals */}
          <div className="border-2 border-gray-800">
            <div className="bg-gray-200 p-3 font-bold border-b-2 border-gray-800">
              Recent Referrals
            </div>
            <div className="divide-y-2 divide-gray-300">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 flex justify-between items-center">
                  <div>
                    <div className="font-bold">Candidate Name {i}</div>
                    <div className="text-sm text-gray-600">Senior Developer - Engineering</div>
                  </div>
                  <div className="border border-orange-500 bg-orange-50 px-3 py-1 text-sm">
                    Under Review
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const JobsView = () => (
    <div className="p-6">
      <div className="border-2 border-gray-800 bg-white">
        {/* Header */}
        <div className="border-b-2 border-gray-800 p-4">
          <div className="text-xl font-bold">BROWSE OPEN POSITIONS</div>
        </div>

        {/* Search & Filter */}
        <div className="p-4 border-b-2 border-gray-800 bg-gray-50">
          <div className="flex gap-3">
            <div className="flex-1 border-2 border-gray-400 p-2 flex items-center gap-2">
              <Search size={20} />
              <input type="text" placeholder="Search by job title, skills, department..." className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="border-2 border-gray-400 px-4 py-2">Filter by Department ▼</div>
            <div className="border-2 border-gray-400 px-4 py-2">Filter by Location ▼</div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="p-4 space-y-3">
          {[
            { title: 'Senior Full Stack Developer', dept: 'Engineering', loc: 'Remote', bonus: '$3,000' },
            { title: 'Product Manager', dept: 'Product', loc: 'Hyderabad', bonus: '$2,500' },
            { title: 'UX Designer', dept: 'Design', loc: 'Bangalore', bonus: '$2,000' }
          ].map((job, i) => (
            <div key={i} className="border-2 border-gray-800 p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-bold text-lg">{job.title}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {job.dept} • {job.loc} • Full-time
                  </div>
                  <div className="mt-2 text-sm">
                    Required: 5+ years experience, React, Node.js, AWS
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-600 font-bold">{job.bonus} Referral Bonus</div>
                  <button className="mt-2 bg-blue-600 text-white px-6 py-2 border-2 border-gray-800 font-bold hover:bg-blue-700">
                    REFER CANDIDATE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const FormView = () => (
    <div className="p-6">
      <div className="border-2 border-gray-800 bg-white max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b-2 border-gray-800 p-4 bg-blue-600 text-white">
          <div className="text-xl font-bold">SUBMIT REFERRAL</div>
          <div className="text-sm">Senior Full Stack Developer - Engineering</div>
        </div>

        <div className="p-6 space-y-6">
          {/* Candidate Information */}
          <div className="border-2 border-gray-800 p-4">
            <div className="font-bold mb-4 text-lg">CANDIDATE INFORMATION</div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">First Name *</label>
                  <input type="text" className="w-full border-2 border-gray-400 p-2" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Last Name *</label>
                  <input type="text" className="w-full border-2 border-gray-400 p-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Email Address *</label>
                <input type="email" className="w-full border-2 border-gray-400 p-2" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Phone Number *</label>
                <input type="tel" className="w-full border-2 border-gray-400 p-2" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">LinkedIn Profile (Optional)</label>
                <input type="url" className="w-full border-2 border-gray-400 p-2" />
              </div>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="border-2 border-gray-800 p-4">
            <div className="font-bold mb-4 text-lg">RESUME/CV</div>
            <div className="border-2 border-dashed border-gray-400 p-8 text-center">
              <Upload className="mx-auto mb-2" size={32} />
              <div className="font-bold">Drag & Drop or Click to Upload</div>
              <div className="text-sm text-gray-600">PDF, DOC, DOCX (Max 5MB)</div>
            </div>
          </div>

          {/* Relationship */}
          <div className="border-2 border-gray-800 p-4">
            <div className="font-bold mb-4 text-lg">YOUR RELATIONSHIP</div>
            <div>
              <label className="block text-sm font-bold mb-1">How do you know this candidate? *</label>
              <select className="w-full border-2 border-gray-400 p-2">
                <option>Select relationship</option>
                <option>Former Colleague</option>
                <option>Professional Network</option>
                <option>Friend</option>
                <option>Other</option>
              </select>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-bold mb-1">Why is this candidate a good fit? *</label>
              <textarea className="w-full border-2 border-gray-400 p-2 h-24" placeholder="Tell us about their skills, experience, and why they'd be great for this role..."></textarea>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button className="flex-1 bg-blue-600 text-white p-3 font-bold border-2 border-gray-800 hover:bg-blue-700">
              SUBMIT REFERRAL
            </button>
            <button className="border-2 border-gray-800 px-6 py-3 font-bold hover:bg-gray-100">
              SAVE AS DRAFT
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const EmailView = () => (
    <div className="p-6">
      <div className="border-2 border-gray-800 bg-white max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b-2 border-gray-800 p-4 bg-green-600 text-white">
          <div className="text-xl font-bold">EMAIL REFERRAL OPTION</div>
        </div>

        <div className="p-6 space-y-6">
          {/* Email Template */}
          <div className="border-2 border-gray-800">
            <div className="bg-gray-100 p-3 border-b-2 border-gray-800 font-bold">
              REFERRAL EMAIL TEMPLATE
            </div>
            <div className="p-4 space-y-3 bg-white">
              <div className="flex gap-2">
                <span className="font-bold w-16">To:</span>
                <span className="text-gray-600">referrals@company.com</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold w-16">Subject:</span>
                <span className="text-gray-600">Employee Referral - [Candidate Name] for [Position]</span>
              </div>
              <div className="border-t-2 border-gray-300 pt-3 text-sm space-y-2">
                <p>Hi Recruiting Team,</p>
                <p>I would like to refer <strong>[CANDIDATE NAME]</strong> for the position of <strong>[JOB TITLE]</strong>.</p>
                <p><strong>Candidate Details:</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Name: [Full Name]</li>
                  <li>Email: [Email]</li>
                  <li>Phone: [Phone]</li>
                  <li>LinkedIn: [URL]</li>
                </ul>
                <p><strong>Recommendation:</strong></p>
                <p>[Your detailed recommendation and why they're a good fit]</p>
                <p>Resume attached.</p>
                <p>Best regards,<br/>[Your Name]</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="border-2 border-blue-500 bg-blue-50 p-4">
            <div className="font-bold mb-2">📧 How Email Referrals Work:</div>
            <ol className="list-decimal ml-6 space-y-1 text-sm">
              <li>Send referral email to referrals@company.com</li>
              <li>System auto-detects and creates referral record</li>
              <li>You'll receive confirmation within 24 hours</li>
              <li>Track status in the portal</li>
            </ol>
          </div>

          {/* Alternative */}
          <div className="text-center">
            <div className="text-gray-600 mb-3">OR</div>
            <button className="bg-blue-600 text-white px-8 py-3 font-bold border-2 border-gray-800 hover:bg-blue-700">
              USE WEB FORM INSTEAD
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ConfirmationView = () => (
    <div className="p-6">
      <div className="border-2 border-gray-800 bg-white max-w-2xl mx-auto">
        <div className="p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto border-4 border-gray-800">
            <Check size={48} className="text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold mb-2">REFERRAL SUBMITTED!</div>
            <div className="text-gray-600">Your referral has been successfully submitted to the recruiting team.</div>
          </div>

          <div className="border-2 border-gray-800 p-6 text-left">
            <div className="font-bold mb-3">REFERRAL DETAILS</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Candidate:</span>
                <span className="font-bold">John Doe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Position:</span>
                <span className="font-bold">Senior Full Stack Developer</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Referral ID:</span>
                <span className="font-bold">REF-2024-001234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Submitted:</span>
                <span className="font-bold">Dec 9, 2025</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-500 p-4 text-sm text-left">
            <div className="font-bold mb-2">What's Next?</div>
            <ul className="space-y-1">
              <li>✓ Recruiting team will review within 2-3 business days</li>
              <li>✓ Candidate will be contacted if qualified</li>
              <li>✓ You'll receive updates via email and portal</li>
              <li>✓ Earn $3,000 bonus upon successful hire!</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 bg-blue-600 text-white p-3 font-bold border-2 border-gray-800 hover:bg-blue-700">
              REFER ANOTHER CANDIDATE
            </button>
            <button className="flex-1 border-2 border-gray-800 p-3 font-bold hover:bg-gray-100">
              VIEW ALL REFERRALS
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const TrackingView = () => (
    <div className="p-6">
      <div className="border-2 border-gray-800 bg-white">
        {/* Header */}
        <div className="border-b-2 border-gray-800 p-4">
          <div className="text-xl font-bold">TRACK REFERRALS</div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b-2 border-gray-800 bg-gray-50 flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white font-bold border-2 border-gray-800">All (8)</button>
          <button className="px-4 py-2 border-2 border-gray-800 hover:bg-gray-100">Under Review (3)</button>
          <button className="px-4 py-2 border-2 border-gray-800 hover:bg-gray-100">Interviewing (2)</button>
          <button className="px-4 py-2 border-2 border-gray-800 hover:bg-gray-100">Hired (2)</button>
          <button className="px-4 py-2 border-2 border-gray-800 hover:bg-gray-100">Declined (1)</button>
        </div>

        {/* Referral List */}
        <div className="p-4 space-y-3">
          {[
            { name: 'John Doe', position: 'Senior Full Stack Developer', date: 'Dec 9, 2025', status: 'Under Review', color: 'orange' },
            { name: 'Jane Smith', position: 'Product Manager', date: 'Dec 5, 2025', status: 'Interviewing', color: 'blue' },
            { name: 'Mike Johnson', position: 'UX Designer', date: 'Nov 28, 2025', status: 'Hired', color: 'green' }
          ].map((ref, i) => (
            <div key={i} className="border-2 border-gray-800 p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-bold text-lg">{ref.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{ref.position}</div>
                  <div className="text-xs text-gray-500 mt-1">Submitted: {ref.date}</div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Submitted</span>
                      <span>Screening</span>
                      <span>Interview</span>
                      <span>Decision</span>
                    </div>
                    <div className="h-2 bg-gray-200 border border-gray-400">
                      <div className={`h-full bg-${ref.color}-500`} style={{width: ref.status === 'Hired' ? '100%' : ref.status === 'Interviewing' ? '66%' : '33%'}}></div>
                    </div>
                  </div>
                </div>
                <div className={`border-2 border-${ref.color}-500 bg-${ref.color}-50 px-4 py-2 font-bold`}>
                  {ref.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderView = () => {
    switch(activeView) {
      case 'navigation': return <NavigationView />;
      case 'dashboard': return <DashboardView />;
      case 'jobs': return <JobsView />;
      case 'form': return <FormView />;
      case 'email': return <EmailView />;
      case 'confirmation': return <ConfirmationView />;
      case 'tracking': return <TrackingView />;
      default: return <NavigationView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <div className="bg-white border-b-4 border-gray-800 p-4 sticky top-0 z-10">
        <div className="flex gap-2 flex-wrap">
          {screens.map(screen => (
            <button
              key={screen.id}
              onClick={() => setActiveView(screen.id)}
              className={`px-4 py-2 font-bold border-2 border-gray-800 transition-colors ${
                activeView === screen.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              {screen.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {renderView()}
      </div>

      {/* Footer Note */}
      <div className="bg-gray-800 text-white p-4 text-center text-sm">
        <strong>WIREFRAME PROTOTYPE</strong> - Click tabs above to navigate between screens
      </div>
    </div>
  );
};

export default ReferralWireframes;