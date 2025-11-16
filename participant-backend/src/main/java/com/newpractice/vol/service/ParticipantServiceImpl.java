package com.newpractice.vol.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.newpractice.vol.entity.Participant;
import com.newpractice.vol.repository.ParticipantRepository;

@Service
public class ParticipantServiceImpl implements ParticipantService {

    @Autowired
    private ParticipantRepository participantRepository;

    @Override
    public Participant addParticipant(Participant participant) {
        return participantRepository.save(participant);
    }

    @Override
    public List<Participant> getAllParticipants() {
        return participantRepository.findAll();
    }

    @Override
    public Participant getParticipantById(int id) {
        Optional<Participant> opt = participantRepository.findById(id);
        return opt.orElse(null);
    }

    @Override
    public Participant updateParticipant(Participant participant) {
        return participantRepository.save(participant);
    }

    @Override
    public void deleteParticipantById(int id) {
        participantRepository.deleteById(id);
    }
}
