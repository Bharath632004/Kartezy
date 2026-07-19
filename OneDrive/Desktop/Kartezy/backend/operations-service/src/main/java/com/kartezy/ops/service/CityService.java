package com.kartezy.ops.service;

import com.kartezy.ops.constants.OpsConstants;
import com.kartezy.ops.entity.City;
import com.kartezy.ops.exception.OpsException;
import com.kartezy.ops.repository.CityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CityService {

    private final CityRepository cityRepository;

    @Cacheable(value = OpsConstants.CACHE_CITIES)
    public List<City> getAllCities() {
        return cityRepository.findAll();
    }

    @Cacheable(value = OpsConstants.CACHE_CITIES, key = "#id")
    public City getCityById(Long id) {
        return cityRepository.findById(id)
            .orElseThrow(() -> new OpsException("City not found with id: " + id, "CITY_NOT_FOUND"));
    }

    public City getCityByName(String name) {
        return cityRepository.findByName(name)
            .orElseThrow(() -> new OpsException("City not found: " + name, "CITY_NOT_FOUND"));
    }

    public List<City> getCitiesByStatus(String status) {
        return cityRepository.findByStatus(status);
    }

    public List<City> getCitiesByRegion(String region) {
        return cityRepository.findByRegion(region);
    }

    public List<City> getActiveCities() {
        return cityRepository.findByIsActiveTrue();
    }

    @Transactional
    @CacheEvict(value = OpsConstants.CACHE_CITIES, allEntries = true)
    public City createCity(City city) {
        if (cityRepository.findByName(city.getName()).isPresent()) {
            throw new OpsException("City already exists: " + city.getName(), "CITY_EXISTS");
        }
        if (city.getStatus() == null) city.setStatus(OpsConstants.CITY_LAUNCHING);
        return cityRepository.save(city);
    }

    @Transactional
    @CacheEvict(value = OpsConstants.CACHE_CITIES, allEntries = true)
    public City updateCity(Long id, City updated) {
        City city = getCityById(id);
        city.setName(updated.getName());
        city.setState(updated.getState());
        city.setRegion(updated.getRegion());
        city.setStatus(updated.getStatus());
        city.setLaunchDate(updated.getLaunchDate());
        city.setServiceablePinCodes(updated.getServiceablePinCodes());
        city.setNotes(updated.getNotes());
        city.setLatitude(updated.getLatitude());
        city.setLongitude(updated.getLongitude());
        city.setIsActive(updated.getIsActive());
        return cityRepository.save(city);
    }

    @Transactional
    @CacheEvict(value = OpsConstants.CACHE_CITIES, allEntries = true)
    public void updateCityStatus(Long id, String status) {
        City city = getCityById(id);
        city.setStatus(status);
        cityRepository.save(city);
    }

    @Transactional
    @CacheEvict(value = OpsConstants.CACHE_CITIES, allEntries = true)
    public void deleteCity(Long id) {
        City city = getCityById(id);
        city.setIsActive(false);
        cityRepository.save(city);
    }

    public List<Object[]> getCityCountByRegion() {
        return cityRepository.countByRegion();
    }

    public List<Object[]> getCityCountByStatus() {
        return cityRepository.countByStatus();
    }
}
