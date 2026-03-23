'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Lock, MapPin, Plus, Trash2, Eye, EyeOff, Loader2, Check, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { addressSchema } from '@/lib/validators';
import { selectCurrentUser } from '@/store/slices/authSlice';
import useAuth from '@/hooks/useAuth';
import api from '@/services/api';
import { toast } from 'sonner';
import AuthGuard from '@/components/auth/AuthGuard';

const GOLD = '#b8976a';

export default function ProfilePage() {
  const user = useSelector(selectCurrentUser);
  const { updateProfile } = useAuth();
  
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [addingAddress, setAddingAddress] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const profileForm = useForm({ defaultValues: { name: user?.name || '', phone: user?.phone || '' } });
  const passwordForm = useForm();
  const addressForm = useForm({ resolver: zodResolver(addressSchema) });

  const onProfileSave = async (data) => {
    setSavingProfile(true);
    await updateProfile(data);
    setSavingProfile(false);
  };

  const onPasswordChange = async (data) => {
    if (data.newPassword !== data.confirmPassword) { toast.error('Passwords do not match', { style: { background: '#111', color: '#ff4d4f', border: '1px solid #ff4d4f' }}); return; }
    setChangingPassword(true);
    try {
      await api.patch('/users/change-password', { currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Security key updated successfully', { style: { background: '#111', color: GOLD, border: `1px solid ${GOLD}` }});
      passwordForm.reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to change password', { style: { background: '#111', color: '#ff4d4f', border: '1px solid #ff4d4f' }});
    } finally { setChangingPassword(false); }
  };

  const onAddAddress = async (data) => {
    try {
      const res = await api.post('/users/addresses', data);
      setAddresses(res.data.data.addresses);
      toast.success('Destination added to profile', { style: { background: '#111', color: GOLD, border: `1px solid ${GOLD}` }});
      addressForm.reset();
      setAddingAddress(false);
    } catch { toast.error('Failed to add destination', { style: { background: '#111', color: '#ff4d4f', border: '1px solid #ff4d4f' }}); }
  };

  const onDeleteAddress = async (index) => {
    try {
      const res = await api.delete(`/users/addresses/${index}`);
      setAddresses(res.data.data.addresses);
      toast.success('Destination removed', { style: { background: '#111', color: GOLD, border: `1px solid ${GOLD}` }});
    } catch { toast.error('Failed to delete destination', { style: { background: '#111', color: '#ff4d4f', border: '1px solid #ff4d4f' }}); }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      await api.patch('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Profile imagery updated', { style: { background: '#111', color: GOLD, border: `1px solid ${GOLD}` }});
    } catch { toast.error('Upload failed', { style: { background: '#111', color: '#ff4d4f', border: '1px solid #ff4d4f' }}); }
    finally { setAvatarUploading(false); }
  };

  // Luxury dark theme input style
  const inputStyle = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 0,
    color: 'white',
    padding: '0 0 10px 0',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '0.85rem'
  };

  const labelStyle = {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '0.65rem',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    marginBottom: '8px',
    display: 'block'
  };

  return (
    <AuthGuard>
      <div style={{ background: '#080808', minHeight: '100vh', paddingTop: '1px', paddingBottom: '4rem' }}>
        <div className="container-custom py-12 max-w-4xl">
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: 'white', marginBottom: '3rem', letterSpacing: '-0.02em', lineHeight: 1 }}>
            Member Profile
          </h1>

          {/* Avatar Section */}
          <div className="p-8 mb-10 flex items-center gap-8 relative overflow-hidden" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#b8976a] rounded-full blur-[100px] opacity-5 pointer-events-none" />
            
            <div className="relative shrink-0">
              <Avatar className="w-24 h-24" style={{ border: `1px solid ${GOLD}44` }}>
                <AvatarImage src={user?.avatar?.url} style={{ objectFit: 'cover' }} />
                <AvatarFallback style={{ background: '#111', color: GOLD, fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem' }}>
                  {user?.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <label className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105" style={{ background: GOLD, border: '4px solid #0a0a0a' }}>
                {avatarUploading ? <Loader2 className="w-4 h-4 text-black animate-spin" /> : <Edit2 className="w-3.5 h-3.5 text-black" />}
                <input type="file" className="sr-only" accept="image/*" onChange={handleAvatarChange} disabled={avatarUploading} />
              </label>
            </div>
            
            <div className="relative z-10">
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', color: 'white', lineHeight: 1.1 }}>{user?.name}</p>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '6px', letterSpacing: '0.05em' }}>{user?.email}</p>
              <span className="inline-block mt-4 px-3 py-1" style={{ border: `1px solid ${GOLD}44`, color: GOLD, fontFamily: "'Montserrat', sans-serif", fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                {user?.role === 'admin' ? 'Administrator' : 'Privileged Member'}
              </span>
            </div>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-10 w-full justify-start h-auto p-0 bg-transparent border-b border-white/10 rounded-none gap-8">
              {[
                { value: 'profile', icon: User, label: 'Personal Details' },
                { value: 'password', icon: Lock, label: 'Security' },
                { value: 'addresses', icon: MapPin, label: 'Destinations' }
              ].map(({ value, icon: Icon, label }) => (
                <TabsTrigger 
                  key={value}
                  value={value} 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#b8976a] data-[state=active]:bg-transparent data-[state=active]:shadow-none p-0 pb-4 data-[state=active]:text-white text-white/40 transition-all font-normal gap-2"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                >
                  <Icon className="w-4 h-4" /> {label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="animate-in fade-in duration-500">
              <div className="p-8 sm:p-12" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)' }}>
                <form onSubmit={profileForm.handleSubmit(onProfileSave)} className="space-y-8 max-w-xl">
                  <div>
                    <Label style={labelStyle}>Full Name</Label>
                    <Input {...profileForm.register('name', { required: true })} style={inputStyle} className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#b8976a] transition-all" />
                  </div>
                  <div>
                    <Label style={labelStyle}>Email Address</Label>
                    <Input value={user?.email} disabled style={{ ...inputStyle, color: 'rgba(255,255,255,0.3)' }} className="focus-visible:ring-0 focus-visible:ring-offset-0" />
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: '8px' }}>The primary email cannot be altered.</p>
                  </div>
                  <div>
                    <Label style={labelStyle}>Direct Contact</Label>
                    <Input {...profileForm.register('phone')} placeholder="+91 90000 00000" style={inputStyle} className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#b8976a] transition-all placeholder:text-white/10" />
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit" disabled={savingProfile} className="rounded-none hover:opacity-90 gap-3" style={{ background: GOLD, color: '#000', fontFamily: "'Montserrat', sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', height: '48px', padding: '0 2rem' }}>
                      {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      {savingProfile ? 'Updating...' : 'Save Preferences'}
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>

            {/* Password Tab */}
            <TabsContent value="password" className="animate-in fade-in duration-500">
              <div className="p-8 sm:p-12" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)' }}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordChange)} className="space-y-8 max-w-xl">
                  {[
                    { name: 'currentPassword', label: 'Current Key' },
                    { name: 'newPassword', label: 'New Key' },
                    { name: 'confirmPassword', label: 'Verify New Key' },
                  ].map(({ name, label }) => (
                    <div key={name}>
                      <Label style={labelStyle}>{label}</Label>
                      <div className="relative">
                        <Input type={passwordVisible ? 'text' : 'password'} {...passwordForm.register(name, { required: true })} style={{ ...inputStyle, letterSpacing: passwordVisible ? 'normal' : '0.2em' }} className="pr-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#b8976a] transition-all" />
                        <button type="button" onClick={() => setPasswordVisible(v => !v)} className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors pb-2">
                          {passwordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4">
                    <Button type="submit" disabled={changingPassword} className="rounded-none hover:opacity-90 gap-3" style={{ background: GOLD, color: '#000', fontFamily: "'Montserrat', sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', height: '48px', padding: '0 2rem' }}>
                      {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                      Update Security
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="animate-in fade-in duration-500">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((addr, i) => (
                    <div key={i} className="p-8 relative group" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <button onClick={() => onDeleteAddress(i)} className="absolute top-6 right-6 text-white/20 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="space-y-2">
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: 'white', display: 'flex', alignItems: 'center', gap: '12px', lineHeight: 1 }}>
                          {addr.fullName} 
                          {addr.isDefault && <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.5rem', background: 'rgba(184,151,106,0.1)', color: GOLD, padding: '4px 8px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Primary</span>}
                        </p>
                        <div style={{ paddingTop: '1rem', fontFamily: "'Montserrat', sans-serif", fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.8 }}>
                          <p>{addr.street}</p>
                          <p>{addr.city}, {addr.state} — {addr.zipCode}</p>
                          <p style={{ marginTop: '0.5rem', color: 'rgba(255,255,255,0.6)' }}>{addr.phone}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {!addingAddress && (
                    <button 
                      onClick={() => setAddingAddress(true)} 
                      className="p-8 flex flex-col items-center justify-center gap-4 transition-colors hover:bg-white/5" 
                      style={{ border: '1px dashed rgba(255,255,255,0.1)', minHeight: '200px' }}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ border: `1px solid ${GOLD}44` }}>
                        <Plus style={{ width: '16px', height: '16px', color: GOLD }} />
                      </div>
                      <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.7rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.15em' }}>New Destination</span>
                    </button>
                  )}
                </div>

                {addingAddress && (
                  <div className="p-8 sm:p-12 animate-in fade-in slide-in-from-top-4" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', color: 'white', marginBottom: '2rem' }}>Add Destination</h3>
                    <form onSubmit={addressForm.handleSubmit(onAddAddress)} className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {[
                        { name: 'fullName', label: 'Recipient Name', span: false },
                        { name: 'phone', label: 'Contact Number', span: false },
                        { name: 'street', label: 'Street Details', span: true },
                        { name: 'city', label: 'City', span: false },
                        { name: 'state', label: 'State / Province', span: false },
                        { name: 'zipCode', label: 'Postal Code', span: false },
                        { name: 'country', label: 'Country', span: false, default: 'India' }
                      ].map(({ name, label, span }) => (
                        <div key={name} className={span ? 'sm:col-span-2' : ''}>
                          <Label style={labelStyle}>{label}</Label>
                          <Input {...addressForm.register(name)} style={inputStyle} className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#b8976a] transition-all" />
                        </div>
                      ))}
                      
                      <div className="sm:col-span-2 flex gap-4 pt-4">
                        <Button type="submit" className="rounded-none hover:opacity-90" style={{ background: GOLD, color: '#000', fontFamily: "'Montserrat', sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', height: '48px', padding: '0 2rem' }}>
                          Save
                        </Button>
                        <Button type="button" onClick={() => setAddingAddress(false)} className="rounded-none hover:bg-white/5 transition-colors" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontFamily: "'Montserrat', sans-serif", fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', height: '48px', padding: '0 2rem' }}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </AuthGuard>
  );
}
