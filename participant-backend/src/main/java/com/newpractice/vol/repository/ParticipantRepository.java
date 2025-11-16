package com.newpractice.vol.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.newpractice.vol.entity.Participant;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Integer> {
    Participant findByEmail(String email);
    Participant findByContact(String contact);
}
