'use client';
import { useState, useEffect } from "react";
import { UserPlus, Users, Target, Clock, Award, MapPin } from "lucide-react";
import { supabase } from '@/lib/supabaseClient';

export default function RegistrationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [event, setEvent] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    designation: '',
    other_designation: '',
    linkedin: '',
    city: ''
  });

  useEffect(() => {
    // Fetch latest event
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .limit(1);
      if (!error && data && data.length > 0) {
        setEvent(data[0]);
      }
    };
    fetchEvent();
    // Fetch user
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        setForm(f => ({
          ...f,
          name: data.user.user_metadata?.full_name || '',
          email: data.user.email || '',
        }));
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const { name, email, phone, organization, designation, other_designation, linkedin, city } = form;
    if (!event) {
      setError('No event found. Please try again later.');
      return;
    }
    
    const submitObj = {
      name, email, phone, organization, designation,
      linkedin, city,
      other_designation,
      Event_id: event.id // Add the Event_id as a foreign key
    };
    if (designation === 'Other') {
      submitObj.designation = form.other_designation || 'Other';
      submitObj.other_designation = form.other_designation;
    }
    try {
      console.log('Submitting registration data:', JSON.stringify(submitObj, null, 2));
      
      // First check if we can query the table
      const { data: testData, error: testError } = await supabase
        .from('registrations')
        .select('*')
        .limit(1);
      
      if (testError) {
        console.error('Table access error:', testError);
        throw new Error(`Cannot access registrations table: ${testError.message}`);
      }
      
      // Try the insert
      const { data, error } = await supabase
        .from('registrations')
        .insert([submitObj])
        .select()
        .single();
      
      console.log('Registration response:', { data, error });
      
      if (error) {
        console.error('Registration error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Unexpected error during registration:', err);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <section className="relative w-full overflow-hidden bg-gray-50 min-h-screen flex flex-col justify-center items-center pt-32 pb-12 px-2 md:px-6">
      {/* Subtle background shapes for visual interest */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-primary/10 opacity-30 blur-3xl z-0" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-primary/20 opacity-20 blur-2xl z-0" />
      {/* Hero Heading */}
      <div className="relative z-10 w-full max-w-3xl mx-auto text-center mb-10 mt-10">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Register for Our Next Event</h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-2">Join us and be a part of something exciting. Fill in your details to secure your spot!</p>
      </div>
      {/* Event Details Container */}
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center bg-white/90 rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
        <div className="bg-primary/10 rounded-full p-4 mb-4">
          <UserPlus className="w-10 h-10 text-primary" />
        </div>
        {event && (
          <div className="mb-6 w-full text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">{event.title}</h2>
            <div className="text-sm text-muted-foreground mb-4">
              {event.date ? new Date(event.date).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' }) : 'TBA'}
              {event.location && (
                <div className="flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
            
            <div className="w-full space-y-6 text-left">
              {event.About && (
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold text-primary mb-2">About</h3>
                  <p className="text-muted-foreground">{event.About}</p>
                </div>
              )}

              {event.Who_Should_Participate && (
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Who Should Participate
                  </h3>
                  <p className="text-muted-foreground">{event.Who_Should_Participate}</p>
                </div>
              )}

              {event.Why_Participate && (
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Why Participate
                  </h3>
                  <p className="text-muted-foreground">{event.Why_Participate}</p>
                </div>
              )}

              {event.Event_Flow && (
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Event Flow
                  </h3>
                  <div className="text-muted-foreground whitespace-pre-line">{event.Event_Flow}</div>
                </div>
              )}

              {event.Judging_Criteria && (
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Judging Criteria
                  </h3>
                  <div className="text-muted-foreground whitespace-pre-line">{event.Judging_Criteria}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Registration Form Container */}
      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center bg-white/95 rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-primary text-center">Event Registration</h2>
        <p className="mb-6 text-muted-foreground text-center text-base">Fill in your details to secure your spot at the event.</p>
        {submitted ? (
          <div className="bg-green-100 text-green-800 p-4 rounded-md w-full text-center font-medium">Thank you for registering!</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div>
              <label className="block mb-1 font-medium" htmlFor="name">Name</label>
              <input id="name" name="name" type="text" required className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" value={form.name} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" value={form.email} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="phone">Phone Number</label>
              <input id="phone" name="phone" type="tel" required className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" value={form.phone} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="organization">Organization</label>
              <input id="organization" name="organization" type="text" className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" value={form.organization} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="designation">Designation</label>
              <select
                id="designation"
                name="designation"
                required
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={form.designation}
                onChange={e => setForm(f => ({ ...f, designation: e.target.value, other_designation: '' }))}
              >
                <option value="" disabled>Select your designation</option>
                <option value="College Student">College Student</option>
                <option value="Startup Founder">Startup Founder</option>
                <option value="Working Professional">Working Professional</option>
                <option value="Faculty/Professor">Faculty/Professor</option>
                <option value="Investor">Investor</option>
                <option value="Other">Other</option>
              </select>
              {form.designation === 'Other' && (
                <input
                  id="other_designation"
                  name="other_designation"
                  type="text"
                  placeholder="Please specify"
                  className="mt-2 w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={form.other_designation}
                  onChange={e => setForm(f => ({ ...f, other_designation: e.target.value }))}
                  required
                />
              )}
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="linkedin">LinkedIn Profile</label>
              <input id="linkedin" name="linkedin" type="url" className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" value={form.linkedin} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="city">City</label>
              <input id="city" name="city" type="text" className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" value={form.city} onChange={handleChange} />
            </div>
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            <button type="submit" className="bg-primary text-primary-foreground px-8 py-3 rounded-md hover:bg-primary/90 transition text-lg font-semibold w-full">Register</button>
          </form>
        )}
      </div>
    </section>
  );
} 