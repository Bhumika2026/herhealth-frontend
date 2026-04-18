// src/pages/DoctorPage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { initiatePayment } from '@/services/paymentService';
import api from '@/services/api';
import toast from 'react-hot-toast';
import PageHeader from '@/components/layout/PageHeader';
import { Star, Video, MessageCircle, MapPin, Zap } from 'lucide-react';
import clsx from 'clsx';

const SPECIALTIES = [
  { id: '', label: 'All' },
  { id: 'gynecologist', label: 'Gynecologist' },
  { id: 'fertility', label: 'Fertility' },
  { id: 'endocrinologist', label: 'Endocrinologist' },
  { id: 'ayurveda', label: 'Ayurveda' },
];

// Mock doctors for demo (backend would return these from DB seed)
const MOCK_DOCTORS = [
  {
    _id: '1', name: 'Dr. Meera Agarwal', specialty: 'gynecologist',
    experience: 15, rating: 4.9, reviewCount: 234,
    consultationFee: 500, videoFee: 400,
    expertise: ['PCOS Expert', 'High Risk Pregnancy'],
    location: { city: 'Mumbai', clinic: 'Apollo Hospital' },
    nextAvailable: 'Today, 4:00 PM', verified: true,
    bio: 'Specialist in reproductive health & PCOS management with 15 years of experience.',
  },
  {
    _id: '2', name: 'Dr. Priya Patel', specialty: 'fertility',
    experience: 12, rating: 4.8, reviewCount: 189,
    consultationFee: 600, videoFee: 500,
    expertise: ['Infertility', 'IVF Specialist'],
    location: { city: 'Delhi', clinic: 'Fortis Hospital' },
    nextAvailable: 'Tomorrow, 10:00 AM', verified: true,
    bio: 'Leading fertility expert with 3000+ successful IVF cycles.',
  },
  {
    _id: '3', name: 'Dr. Anjali Desai', specialty: 'gynecologist',
    experience: 20, rating: 4.9, reviewCount: 312,
    consultationFee: 450, videoFee: 350,
    expertise: ['Menopause', 'Hormonal Issues'],
    location: { city: 'Bangalore', clinic: 'Manipal Hospital' },
    nextAvailable: 'Today, 6:30 PM', verified: true,
    bio: 'Expert in menopause management and hormonal health for women of all ages.',
  },
  {
    _id: '4', name: 'Dr. Sunita Rao', specialty: 'ayurveda',
    experience: 18, rating: 4.7, reviewCount: 156,
    consultationFee: 300, videoFee: 250,
    expertise: ['PCOS Ayurveda', 'Infertility'],
    location: { city: 'Pune', clinic: 'Ayushman Clinic' },
    nextAvailable: 'Today, 2:00 PM', verified: true,
    bio: 'Classical Ayurveda practitioner specializing in women\'s reproductive health.',
  },
];

function DoctorCard({ doctor, onBook }) {
  const [bookLoading, setBookLoading] = useState(false);
  const { user } = useAuth();

  const handleBook = async (type) => {
    setBookLoading(true);
    try {
      await initiatePayment({
        type: type === 'video' ? 'consultation' : 'consultation',
        doctorId: doctor._id,
        userData: { name: user.name, email: user.email },
      });
      toast.success(`Appointment booked with ${doctor.name}! 🎉`);
    } catch (err) {
      if (err.message !== 'Payment cancelled by user') {
        toast.error(err.message || 'Booking failed');
      }
    } finally {
      setBookLoading(false);
    }
  };

  return (
    <div className="card mb-3">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
             style={{ background: 'linear-gradient(135deg, #E8647A, #B8A9C9)' }}>
          {doctor.name.split(' ').slice(-1)[0][0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-charcoal text-sm">{doctor.name}</h3>
            {doctor.verified && <span className="text-rose text-xs">✓</span>}
          </div>
          <p className="text-xs text-gray-400 capitalize">{doctor.specialty} • {doctor.experience} yrs exp</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Star size={11} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-medium">{doctor.rating}</span>
            <span className="text-xs text-gray-400">({doctor.reviewCount})</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-bold text-charcoal text-sm">₹{doctor.consultationFee}</p>
          <p className="text-xs text-gray-400">consult</p>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-2">
        <MapPin size={11} className="text-gray-400" />
        <p className="text-xs text-gray-400">{doctor.location.city} — {doctor.location.clinic}</p>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {doctor.expertise.map(e => (
          <span key={e} className="badge bg-rose-light text-rose">{e}</span>
        ))}
      </div>

      <p className="text-xs text-sage font-medium mb-3">🕐 Next: {doctor.nextAvailable}</p>

      <div className="flex gap-2">
        <button onClick={() => handleBook('video')} disabled={bookLoading}
          className="flex-1 flex items-center justify-center gap-1.5 btn-primary py-2 text-sm">
          <Video size={14} />
          Book Video ₹{doctor.videoFee || doctor.consultationFee}
        </button>
        <button onClick={() => handleBook('chat')}
          className="px-3 py-2 bg-lilac-light text-lilac-dark rounded-2xl text-sm font-medium">
          <MessageCircle size={16} />
        </button>
      </div>
    </div>
  );
}

export default function DoctorPage() {
  const { user } = useAuth();
  const [specialty, setSpecialty] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const filtered = MOCK_DOCTORS.filter(d => {
    if (specialty && d.specialty !== specialty) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleInstantVideo = async () => {
    try {
      await initiatePayment({
        type: 'instant_video',
        userData: { name: user.name, email: user.email },
      });
      toast.success('Connecting you to a doctor… 🩺');
    } catch (err) {
      if (err.message !== 'Payment cancelled by user') {
        toast.error(err.message || 'Connection failed');
      }
    }
  };

  return (
    <div className="fade-in-up">
      <PageHeader title="Find Doctor" subtitle="Book a consultation" />

      {/* Instant Video Banner */}
      <div className="mx-5 mb-4 rounded-3xl p-4 bg-gradient-to-r from-rose to-lilac text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Zap size={14} className="fill-white" />
              <p className="text-sm font-semibold">Instant Video Call</p>
            </div>
            <p className="text-xs text-white/70">Connect in under 5 mins</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">₹299</p>
            <button onClick={handleInstantVideo}
              className="mt-1 bg-white text-rose text-xs font-bold px-3 py-1.5 rounded-xl">
              Connect Now
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-5 mb-3">
        <input value={search} onChange={e => setSearch(e.target.value)}
          className="input" placeholder="🔍 Search doctors…" />
      </div>

      {/* Specialty filter */}
      <div className="flex gap-2 px-5 mb-4 overflow-x-auto pb-1">
        {SPECIALTIES.map(s => (
          <button key={s.id} onClick={() => setSpecialty(s.id)}
            className={clsx('flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
              specialty === s.id
                ? 'bg-rose text-white border-rose'
                : 'bg-white text-gray-500 border-gray-200 hover:border-rose/40')}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Doctors list */}
      <div className="px-5">
        <p className="text-xs text-gray-400 mb-3">{filtered.length} doctors found</p>
        {filtered.map(doc => (
          <DoctorCard key={doc._id} doctor={doc} />
        ))}
      </div>
    </div>
  );
}
