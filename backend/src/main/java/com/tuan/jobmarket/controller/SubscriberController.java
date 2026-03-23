package com.tuan.jobmarket.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tuan.jobmarket.domain.Subscriber;
import com.tuan.jobmarket.domain.response.ResultPaginationDTO;
import com.tuan.jobmarket.service.SubscriberService;
import com.tuan.jobmarket.util.SecurityUtil;
import com.tuan.jobmarket.util.annotation.ApiMessage;
import com.tuan.jobmarket.util.error.IdInvalidException;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class SubscriberController {

    private final SubscriberService subscriberService;

    public SubscriberController(SubscriberService subscriberService) {
        this.subscriberService = subscriberService;
    }

    @PostMapping("/subscribers")
    @ApiMessage("Create a subscriber")
    public ResponseEntity<Subscriber> create(@Valid @RequestBody Subscriber sub)
            throws IdInvalidException {
        if (this.subscriberService.isExistsByEmail(sub.getEmail())) {
            throw new IdInvalidException("Email " + sub.getEmail() + " đã tồn tại");
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(this.subscriberService.create(sub));
    }

    @PutMapping("/subscribers")
    @ApiMessage("Update a subscriber")
    public ResponseEntity<Subscriber> update(@RequestBody Subscriber subsRequest)
            throws IdInvalidException {
        Subscriber subsDB = this.subscriberService.findById(subsRequest.getId());
        if (subsDB == null) {
            throw new IdInvalidException("Id " + subsRequest.getId() + " không tồn tại");
        }
        return ResponseEntity.ok(this.subscriberService.update(subsDB, subsRequest));
    }

    @PostMapping("/subscribers/skills")
    @ApiMessage("Get subscriber's skills")
    public ResponseEntity<Subscriber> getSubscribersSkill() throws IdInvalidException {
        String email = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get() : "";
        return ResponseEntity.ok(this.subscriberService.findByEmail(email));
    }

    // ✅ FIX: Thêm GET list (callFetchSubscriber)
    @GetMapping("/subscribers")
    @ApiMessage("Fetch all subscribers")
    public ResponseEntity<ResultPaginationDTO> getAllSubscribers(
            @Filter Specification<Subscriber> spec, Pageable pageable) {
        return ResponseEntity.ok(this.subscriberService.findAll(spec, pageable));
    }

    // ✅ FIX: Thêm GET by id (callFetchSubscriberById)
    @GetMapping("/subscribers/{id}")
    @ApiMessage("Fetch subscriber by id")
    public ResponseEntity<Subscriber> getSubscriberById(@PathVariable("id") long id)
            throws IdInvalidException {
        Subscriber sub = this.subscriberService.findById(id);
        if (sub == null) {
            throw new IdInvalidException("Subscriber với id = " + id + " không tồn tại");
        }
        return ResponseEntity.ok(sub);
    }

    // ✅ FIX: Thêm DELETE (callDeleteSubscriber)
    @DeleteMapping("/subscribers/{id}")
    @ApiMessage("Delete a subscriber")
    public ResponseEntity<Void> deleteSubscriber(@PathVariable("id") long id)
            throws IdInvalidException {
        Subscriber sub = this.subscriberService.findById(id);
        if (sub == null) {
            throw new IdInvalidException("Subscriber với id = " + id + " không tồn tại");
        }
        this.subscriberService.delete(id);
        return ResponseEntity.ok(null);
    }
}
