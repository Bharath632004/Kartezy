"use client";

import { Box, Container, Stack, Typography, Card, CardContent, Button, Divider, Chip, Stack as MuiStack, Typography as MuiTypography, TextField, Avatar, GoogleMapsLink, Link } from '@mui/material';
import { Person, Phone, Email, LocationOn, Chat, Headset, HelpOutline, Description, Category, Mail, Link, Web, Map, } from '@mui/icons-material';
import { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // In a real app, we would send this data to the API
      // For now, we'll just simulate a delay and show success
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const officeLocations = [
    {
      id: 1,
      city: 'Bangalore',
      address: '123, Innovative Tech Park, Whitefield, Bangalore - 560066',
      phone: '+91-80-1234-5678',
      email: 'bangalore@kartify.com',
      timings: 'Mon-Sat: 8:00 AM - 8:00 PM',
    },
    {
      id: 2,
      city: 'Mumbai',
      address: '456, Business Bandra Kurla Complex, Mumbai - 400051',
      phone: '+91-22-2345-6789',
      email: 'mumbai@kartify.com',
      timings: 'Mon-Sat: 8:00 AM - 8:00 PM',
    },
    {
      id: 3,
      city: 'Delhi',
      address: '789, Corporate Hub Connaught Place, New Delhi - 110001',
      phone: '+91-11-345-70',
      gmail.com',
      The OpenStreet));
  };